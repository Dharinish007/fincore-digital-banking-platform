package com.example.milestone3.operations;

import com.example.milestone3.audit.AuditLogService;
import com.example.milestone3.operations.entity.Account;
import com.example.milestone3.operations.entity.AccountStatement;
import com.example.milestone3.operations.entity.LoanCollection;
import com.example.milestone3.operations.entity.LoanDisbursement;
import com.example.milestone3.operations.entity.Customer;
import com.example.milestone3.operations.repo.AccountRepo;
import com.example.milestone3.operations.repo.AccountStatementRepo;
import com.example.milestone3.operations.repo.LoanCollectionRepo;
import com.example.milestone3.operations.repo.LoanDisbursementRepo;
import com.example.milestone3.operations.repo.CustomerRepo;
import com.example.milestone3.settlementEngine.entity.Loan;
import com.example.milestone3.settlementEngine.repo.LoanRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OperationsService {
    private final AccountRepo accountRepo;
    private final AccountStatementRepo statementRepo;
    private final LoanRepo loanRepo;
    private final LoanDisbursementRepo disbursementRepo;
    private final LoanCollectionRepo collectionRepo;
    private final CustomerRepo customerRepo;
    private final com.example.milestone3.settlementEngine.repo.TransactionRepo transactionRepo;
    private final AuditLogService auditLogService;

    public List<OperationsDtos.AccountResponse> accounts() {
        List<Account> list = accountRepo.findAll();
        List<Customer> custList = customerRepo.findAll();
        java.util.Map<Long, Customer> map = custList.stream().collect(java.util.stream.Collectors.toMap(Customer::getId, c -> c, (a, b) -> a));
        return list.stream().map(a -> {
            Customer c = a.getCustomerId() != null ? map.get(a.getCustomerId()) : null;
            return new OperationsDtos.AccountResponse(
                a.getId(),
                a.getAccountNumber(),
                a.getCustomerId(),
                c != null ? c.getFullName() : "Customer #" + a.getCustomerId(),
                c != null ? c.getEmail() : "client" + a.getCustomerId() + "@fincore.com",
                c != null ? c.getPhoneNumber() : "+91 98765 43210",
                a.getAccountType(),
                a.getBalance(),
                a.getStatus(),
                a.getOpenedAt()
            );
        }).toList();
    }

    public List<Customer> customers() { return customerRepo.findAll(); }

    public List<OperationsDtos.LoanDetailResponse> loans() {
        List<Loan> list = loanRepo.findAll();
        List<Customer> custList = customerRepo.findAll();
        java.util.Map<Long, Customer> map = custList.stream().collect(java.util.stream.Collectors.toMap(Customer::getId, c -> c, (a, b) -> a));
        return list.stream().map(l -> {
            Customer c = l.getCustomerId() != null ? map.get(l.getCustomerId()) : null;
            BigDecimal sanctioned = l.getTotalOutstanding() != null ? l.getTotalOutstanding().multiply(BigDecimal.valueOf(1.2)).setScale(2, RoundingMode.HALF_UP) : BigDecimal.valueOf(500000);
            BigDecimal remaining = sanctioned.subtract(l.getTotalOutstanding() != null ? l.getTotalOutstanding() : BigDecimal.ZERO).max(BigDecimal.ZERO);
            BigDecimal monthlyEmi = l.getTotalOutstanding() != null && l.getTotalOutstanding().compareTo(BigDecimal.ZERO) > 0 ? l.getTotalOutstanding().divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP) : BigDecimal.valueOf(10000);
            return new OperationsDtos.LoanDetailResponse(
                l.getId(),
                "LN1000" + l.getId(),
                l.getCustomerId(),
                c != null ? c.getFullName() : "Borrower #" + l.getCustomerId(),
                "Home Loan",
                sanctioned,
                l.getTotalOutstanding() != null ? l.getTotalOutstanding() : BigDecimal.ZERO,
                remaining,
                l.getPrincipalOutstanding() != null ? l.getPrincipalOutstanding() : l.getTotalOutstanding(),
                l.getTotalOutstanding() != null ? l.getTotalOutstanding() : BigDecimal.ZERO,
                l.getStatus() != null ? l.getStatus() : "ACTIVE",
                BigDecimal.valueOf(8.5),
                60,
                monthlyEmi
            );
        }).toList();
    }

    public List<com.example.milestone3.settlementEngine.entity.Transaction> transactions() { return transactionRepo.findAll(); }
    public List<LoanDisbursement> disbursements() { return disbursementRepo.findAll(); }
    public List<LoanCollection> collections() { return collectionRepo.findAll(); }


    public Account addAccount(OperationsDtos.CreateAccountRequest request) {
        Account account = new Account();
        account.setAccountNumber(request.accountNumber());
        account.setCustomerId(request.customerId() != null ? request.customerId() : 1L);
        account.setAccountType(request.accountType() != null ? request.accountType() : "SAVINGS");
        account.setBalance(request.initialBalance() != null ? request.initialBalance() : BigDecimal.ZERO);
        account.setStatus(request.status() != null ? request.status().toUpperCase() : "ACTIVE");
        account.setOpenedAt(java.time.LocalDate.now());
        Account saved = accountRepo.save(account);
        auditLogService.record(null, "SYSTEM", "ACCOUNT_CREATED", "OPERATIONS", "ACCOUNT", saved.getId().toString(), "Account created #" + saved.getAccountNumber(), "SUCCESS", null);
        return saved;
    }

    public Customer addCustomer(OperationsDtos.CustomerRequest request) {
        if (request.fullName() == null || request.fullName().isBlank() || request.email() == null || request.email().isBlank() || request.phoneNumber() == null || request.phoneNumber().isBlank()) {
            throw new IllegalArgumentException("Name, email, and phone number are required");
        }
        Customer customer = new Customer();
        customer.setFullName(request.fullName()); customer.setEmail(request.email()); customer.setPhoneNumber(request.phoneNumber()); customer.setAccountNumber(request.accountNumber());
        Customer saved = customerRepo.save(customer);
        auditLogService.record(null, "SYSTEM", "CUSTOMER_CREATED", "OPERATIONS", "CUSTOMER", saved.getId().toString(), "Customer created", "SUCCESS", null);
        return saved;
    }

    public List<AccountStatement> statement(Long accountId) {
        List<AccountStatement> statements = statementRepo.findByAccountIdOrderByCreatedAtDesc(accountId);
        auditLogService.record(null, "SYSTEM", "STATEMENT_GENERATED", "OPERATIONS", "ACCOUNT", accountId.toString(), "Account statement retrieved", "SUCCESS", null);
        return statements;
    }

    @Transactional
    public Account updateLifecycle(Long accountId, String status) {
        Account account = accountRepo.findById(accountId).orElseThrow(() -> new IllegalArgumentException("Account not found"));
        account.setStatus(status.toUpperCase());
        Account saved = accountRepo.save(account);
        auditLogService.record(null, "SYSTEM", "ACCOUNT_STATUS_UPDATED", "OPERATIONS", "ACCOUNT", accountId.toString(), "Account status updated to " + status, "SUCCESS", null);
        return saved;
    }

    @Transactional
    public Account adjustBalance(Long accountId, OperationsDtos.BalanceAdjustmentRequest request) {
        Account account = accountRepo.findById(accountId).orElseThrow(() -> new IllegalArgumentException("Account not found"));
        if (request.amount() == null || request.amount().signum() <= 0) throw new IllegalArgumentException("Amount must be positive");
        BigDecimal signedAmount = "DEBIT".equalsIgnoreCase(request.entryType()) ? request.amount().negate() : request.amount();
        BigDecimal updatedBalance = account.getBalance().add(signedAmount);
        if (updatedBalance.signum() < 0) throw new IllegalArgumentException("Insufficient account balance");
        account.setBalance(updatedBalance);
        AccountStatement entry = new AccountStatement();
        entry.setAccountId(accountId); entry.setReference("ADJ-" + UUID.randomUUID()); entry.setEntryType(request.entryType().toUpperCase());
        entry.setAmount(request.amount()); entry.setBalanceAfter(updatedBalance); entry.setDescription(request.description());
        statementRepo.save(entry);
        Account saved = accountRepo.save(account);
        auditLogService.record(null, "SYSTEM", "BALANCE_UPDATED", "OPERATIONS", "ACCOUNT", accountId.toString(), "Account balance adjusted", "SUCCESS", null);
        return saved;
    }

    public OperationsDtos.EmiResult calculateEmi(OperationsDtos.EmiRequest request) {
        if (request.principal() == null || request.annualRate() == null || request.principal().signum() <= 0 || request.tenureMonths() <= 0) {
            throw new IllegalArgumentException("Principal and tenure must be positive");
        }
        BigDecimal monthlyRate = request.annualRate().divide(BigDecimal.valueOf(1200), 12, RoundingMode.HALF_UP);
        double rate = monthlyRate.doubleValue();
        double principal = request.principal().doubleValue();
        double emi = rate == 0 ? principal / request.tenureMonths() : principal * rate * Math.pow(1 + rate, request.tenureMonths()) / (Math.pow(1 + rate, request.tenureMonths()) - 1);
        BigDecimal monthlyEmi = BigDecimal.valueOf(emi).setScale(2, RoundingMode.HALF_UP);
        BigDecimal payable = monthlyEmi.multiply(BigDecimal.valueOf(request.tenureMonths())).setScale(2, RoundingMode.HALF_UP);
        return new OperationsDtos.EmiResult(monthlyEmi, payable.subtract(request.principal()).setScale(2, RoundingMode.HALF_UP), payable);
    }

    @Transactional
    public LoanDisbursement disburse(OperationsDtos.DisbursementRequest request) {
        Loan loan = loanRepo.findById(request.loanId()).orElseThrow(() -> new IllegalArgumentException("Loan not found"));
        if (request.amount() == null || request.amount().signum() <= 0) throw new IllegalArgumentException("Amount must be positive");
        LoanDisbursement item = new LoanDisbursement();
        item.setLoanId(loan.getId()); item.setAmount(request.amount()); item.setChannel(request.channel()); item.setReference("DISB-" + UUID.randomUUID());
        loan.setStatus("DISBURSED"); loanRepo.save(loan);
        LoanDisbursement saved = disbursementRepo.save(item);
        auditLogService.record(null, "SYSTEM", "LOAN_DISBURSED", "OPERATIONS", "LOAN", loan.getId().toString(), "Loan disbursement completed", "SUCCESS", null);
        return saved;
    }

    @Transactional
    public LoanCollection collect(OperationsDtos.CollectionRequest request) {
        Loan loan = loanRepo.findById(request.loanId()).orElseThrow(() -> new IllegalArgumentException("Loan not found"));
        if (request.amount() == null || request.amount().signum() <= 0) throw new IllegalArgumentException("Amount must be positive");
        LoanCollection item = new LoanCollection();
        item.setLoanId(loan.getId()); item.setScheduleId(request.scheduleId()); item.setAmount(request.amount()); item.setChannel(request.channel()); item.setReference("COL-" + UUID.randomUUID());
        loan.setTotalOutstanding(loan.getTotalOutstanding().subtract(request.amount()).max(BigDecimal.ZERO)); loanRepo.save(loan);
        LoanCollection saved = collectionRepo.save(item);
        auditLogService.record(null, "SYSTEM", "LOAN_COLLECTION_RECORDED", "OPERATIONS", "LOAN", loan.getId().toString(), "Loan collection completed", "SUCCESS", null);
        return saved;
    }
}
