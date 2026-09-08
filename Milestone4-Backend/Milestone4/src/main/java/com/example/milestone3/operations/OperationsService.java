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
    private final AuditLogService auditLogService;

    public List<Account> accounts() { return accountRepo.findAll(); }
    public List<Customer> customers() { return customerRepo.findAll(); }
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
