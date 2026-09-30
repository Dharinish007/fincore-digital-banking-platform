package com.fincore.service;

import com.fincore.dto.LoanApplyRequest;
import com.fincore.dto.RepaymentRequest;
import com.fincore.entity.Account;
import com.fincore.entity.Customer;
import com.fincore.entity.Loan;
import com.fincore.entity.RepaymentSchedule;
import com.fincore.entity.Transaction;
import com.fincore.repository.AccountRepository;
import com.fincore.repository.CustomerRepository;
import com.fincore.repository.LoanRepository;
import com.fincore.repository.RepaymentScheduleRepository;
import com.fincore.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private RepaymentScheduleRepository repaymentScheduleRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AuditService auditService;

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan getLoanById(String id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with ID: " + id));
    }

    public List<Loan> getLoansByCustomerId(String customerId) {
        return loanRepository.findByCustomerId(customerId);
    }

    public List<RepaymentSchedule> getRepaymentSchedules(String loanId) {
        return repaymentScheduleRepository.findByLoanIdOrderByInstallmentNumberAsc(loanId);
    }

    public Loan applyLoan(LoanApplyRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + request.getCustomerId()));

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + request.getAccountId()));

        // Calculate EMI using standard standard financial formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
        BigDecimal principal = request.getPrincipalAmount();
        BigDecimal annualRate = request.getInterestRate();
        int tenure = request.getTenureMonths();

        BigDecimal monthlyRate = annualRate.divide(new BigDecimal("1200"), 8, RoundingMode.HALF_UP);
        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
        BigDecimal onePlusRPowerN = onePlusR.pow(tenure, MathContext.DECIMAL64);

        BigDecimal numerator = principal.multiply(monthlyRate).multiply(onePlusRPowerN);
        BigDecimal denominator = onePlusRPowerN.subtract(BigDecimal.ONE);
        BigDecimal emi = numerator.divide(denominator, 2, RoundingMode.HALF_UP);

        BigDecimal totalPayable = emi.multiply(new BigDecimal(tenure));

        String loanNum = "LN-" + request.getLoanType().name().substring(0, 2) + "-" + System.currentTimeMillis() % 1000000;

        Loan loan = Loan.builder()
                .loanNumber(loanNum)
                .customerId(customer.getId())
                .customerName(customer.getFullName())
                .accountId(account.getId())
                .loanType(request.getLoanType())
                .principalAmount(principal)
                .interestRate(annualRate)
                .tenureMonths(tenure)
                .emiAmount(emi)
                .totalPayable(totalPayable)
                .outstandingPrincipal(principal)
                .status(Loan.LoanStatus.UNDER_REVIEW)
                .appliedAt(LocalDateTime.now())
                .build();

        Loan saved = loanRepository.save(loan);

        // Generate Amortization Repayment Schedule
        generateRepaymentSchedule(saved, principal, monthlyRate, emi, tenure);

        auditService.recordAudit("LOAN_APPLIED", "Loan", saved.getId(), customer.getFullName(), "CUSTOMER",
                "Applied for " + request.getLoanType() + " of ₹" + principal);

        return saved;
    }

    private void generateRepaymentSchedule(Loan loan, BigDecimal principal, BigDecimal monthlyRate, BigDecimal emi, int tenure) {
        BigDecimal balance = principal;
        LocalDate startDate = LocalDate.now().plusMonths(1);
        List<RepaymentSchedule> schedules = new ArrayList<>();

        for (int i = 1; i <= tenure; i++) {
            BigDecimal interest = balance.multiply(monthlyRate).setScale(2, RoundingMode.HALF_UP);
            BigDecimal principalComp = emi.subtract(interest).setScale(2, RoundingMode.HALF_UP);
            
            if (i == tenure || principalComp.compareTo(balance) > 0) {
                principalComp = balance;
                emi = principalComp.add(interest);
            }
            balance = balance.subtract(principalComp).max(BigDecimal.ZERO);

            RepaymentSchedule item = RepaymentSchedule.builder()
                    .loanId(loan.getId())
                    .installmentNumber(i)
                    .dueDate(startDate.plusMonths(i - 1))
                    .principalComponent(principalComp)
                    .interestComponent(interest)
                    .totalInstallment(emi)
                    .outstandingBalance(balance)
                    .status(RepaymentSchedule.PaymentStatus.PENDING)
                    .build();

            schedules.add(item);
        }

        repaymentScheduleRepository.saveAll(schedules);
    }

    public Loan approveLoan(String loanId, String approvedBy) {
        Loan loan = getLoanById(loanId);
        loan.setStatus(Loan.LoanStatus.APPROVED);
        loan.setApprovedAt(LocalDateTime.now());
        loan.setApprovedBy(approvedBy != null ? approvedBy : "SUPERVISOR");
        Loan saved = loanRepository.save(loan);

        auditService.recordAudit("LOAN_APPROVED", "Loan", loanId, approvedBy, "SUPERVISOR",
                "Sanctioned loan " + loan.getLoanNumber() + " for ₹" + loan.getPrincipalAmount());

        return saved;
    }

    @Transactional
    public Loan disburseLoan(String loanId, String performedBy) {
        Loan loan = getLoanById(loanId);
        if (loan.getStatus() != Loan.LoanStatus.APPROVED) {
            throw new RuntimeException("Loan must be approved before disbursement.");
        }

        Account account = accountRepository.findByIdWithLock(loan.getAccountId())
                .orElseThrow(() -> new RuntimeException("Disbursement account not found."));

        account.setBalance(account.getBalance().add(loan.getPrincipalAmount()));
        accountRepository.save(account);

        loan.setStatus(Loan.LoanStatus.ACTIVE);
        loan.setDisbursedAt(LocalDateTime.now());
        Loan saved = loanRepository.save(loan);

        // Record Transaction
        String ref = "TXN-DSB-" + System.currentTimeMillis();
        Transaction txn = Transaction.builder()
                .transactionReference(ref)
                .accountId(account.getId())
                .accountNumber(account.getAccountNumber())
                .customerName(account.getCustomerName())
                .type(Transaction.TransactionType.LOAN_DISBURSEMENT)
                .amount(loan.getPrincipalAmount())
                .balanceAfter(account.getBalance())
                .status(Transaction.TransactionStatus.COMPLETED)
                .description("Disbursement of Loan " + loan.getLoanNumber())
                .performedBy(performedBy != null ? performedBy : "SUPERVISOR")
                .build();

        transactionRepository.save(txn);

        auditService.recordAudit("LOAN_DISBURSED", "Loan", loanId, performedBy, "SUPERVISOR",
                "Disbursed ₹" + loan.getPrincipalAmount() + " to Account " + account.getAccountNumber());

        return saved;
    }

    @Transactional
    public RepaymentSchedule payEmi(RepaymentRequest request) {
        Loan loan = getLoanById(request.getLoanId());
        Account account = accountRepository.findByIdWithLock(request.getDebitAccountId())
                .orElseThrow(() -> new RuntimeException("Debit account not found"));

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient account balance to pay EMI");
        }

        List<RepaymentSchedule> schedules = repaymentScheduleRepository.findByLoanIdAndStatus(loan.getId(), RepaymentSchedule.PaymentStatus.PENDING);
        if (schedules.isEmpty()) {
            throw new RuntimeException("No pending EMI installments found for this loan.");
        }

        RepaymentSchedule currentSchedule = schedules.get(0);

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        currentSchedule.setStatus(RepaymentSchedule.PaymentStatus.PAID);
        currentSchedule.setPaidAt(LocalDateTime.now());
        String payRef = "EMI-" + System.currentTimeMillis();
        currentSchedule.setPaymentReference(payRef);
        RepaymentSchedule savedSchedule = repaymentScheduleRepository.save(currentSchedule);

        loan.setOutstandingPrincipal(loan.getOutstandingPrincipal().subtract(currentSchedule.getPrincipalComponent()).max(BigDecimal.ZERO));
        if (loan.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) <= 0) {
            loan.setStatus(Loan.LoanStatus.CLOSED);
        }
        loanRepository.save(loan);

        // Record Transaction
        Transaction txn = Transaction.builder()
                .transactionReference(payRef)
                .accountId(account.getId())
                .accountNumber(account.getAccountNumber())
                .customerName(account.getCustomerName())
                .type(Transaction.TransactionType.EMI_PAYMENT)
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .status(Transaction.TransactionStatus.COMPLETED)
                .description("EMI Repayment for Loan " + loan.getLoanNumber() + " (Inst. #" + currentSchedule.getInstallmentNumber() + ")")
                .performedBy(request.getPerformedBy() != null ? request.getPerformedBy() : "CUSTOMER")
                .build();

        transactionRepository.save(txn);

        auditService.recordAudit("EMI_REPAYMENT", "RepaymentSchedule", currentSchedule.getId(), request.getPerformedBy(), "CUSTOMER",
                "Paid EMI ₹" + request.getAmount() + " for Loan " + loan.getLoanNumber());

        return savedSchedule;
    }
}
