package com.fincore.service;

import com.fincore.dto.DepositRequest;
import com.fincore.dto.TransferRequest;
import com.fincore.dto.WithdrawRequest;
import com.fincore.entity.Account;
import com.fincore.entity.Customer;
import com.fincore.entity.Transaction;
import com.fincore.repository.AccountRepository;
import com.fincore.repository.CustomerRepository;
import com.fincore.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AuditService auditService;

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account getAccountById(String id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));
    }

    public List<Account> getAccountsByCustomerId(String customerId) {
        return accountRepository.findByCustomerId(customerId);
    }

    public Account createAccount(String customerId, Account.AccountType accountType, BigDecimal initialDeposit) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + customerId));

        String accNumber = "10" + String.format("%010d", Math.abs(UUID.randomUUID().getMostSignificantBits() % 10000000000L));

        Account account = Account.builder()
                .accountNumber(accNumber)
                .customerId(customerId)
                .customerName(customer.getFullName())
                .accountType(accountType != null ? accountType : Account.AccountType.SAVINGS)
                .balance(initialDeposit != null ? initialDeposit : BigDecimal.ZERO)
                .currency("INR")
                .status(Account.AccountStatus.ACTIVE)
                .build();

        Account saved = accountRepository.save(account);

        auditService.recordAudit("ACCOUNT_OPENED", "Account", saved.getId(), "TELLER", "TELLER",
                "New " + accountType + " account created for " + customer.getFullName());

        return saved;
    }

    @Transactional
    public Transaction deposit(DepositRequest request) {
        Account account = accountRepository.findByIdWithLock(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + request.getAccountId()));

        if (account.getStatus() == Account.AccountStatus.FROZEN) {
            throw new RuntimeException("Account is FROZEN. Transactions are blocked.");
        }

        account.setBalance(account.getBalance().add(request.getAmount()));
        account.setUpdatedAt(LocalDateTime.now());
        accountRepository.save(account);

        String ref = "TXN-DEP-" + System.currentTimeMillis();
        Transaction txn = Transaction.builder()
                .transactionReference(ref)
                .accountId(account.getId())
                .accountNumber(account.getAccountNumber())
                .customerName(account.getCustomerName())
                .type(Transaction.TransactionType.DEPOSIT)
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .status(Transaction.TransactionStatus.COMPLETED)
                .description(request.getDescription() != null ? request.getDescription() : "Cash Deposit")
                .performedBy(request.getPerformedBy() != null ? request.getPerformedBy() : "TELLER")
                .build();

        Transaction savedTxn = transactionRepository.save(txn);

        auditService.recordAudit("CASH_DEPOSIT", "Account", account.getId(), request.getPerformedBy(), "TELLER",
                "Deposited ₹" + request.getAmount() + " to Account " + account.getAccountNumber());

        return savedTxn;
    }

    @Transactional
    public Transaction withdraw(WithdrawRequest request) {
        Account account = accountRepository.findByIdWithLock(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + request.getAccountId()));

        if (account.getStatus() == Account.AccountStatus.FROZEN) {
            throw new RuntimeException("Account is FROZEN. Withdrawals are blocked.");
        }

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient funds. Available: ₹" + account.getBalance());
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        account.setUpdatedAt(LocalDateTime.now());
        accountRepository.save(account);

        String ref = "TXN-WTH-" + System.currentTimeMillis();
        Transaction txn = Transaction.builder()
                .transactionReference(ref)
                .accountId(account.getId())
                .accountNumber(account.getAccountNumber())
                .customerName(account.getCustomerName())
                .type(Transaction.TransactionType.WITHDRAWAL)
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .status(Transaction.TransactionStatus.COMPLETED)
                .description(request.getDescription() != null ? request.getDescription() : "Cash Withdrawal")
                .performedBy(request.getPerformedBy() != null ? request.getPerformedBy() : "TELLER")
                .build();

        Transaction savedTxn = transactionRepository.save(txn);

        auditService.recordAudit("CASH_WITHDRAWAL", "Account", account.getId(), request.getPerformedBy(), "TELLER",
                "Withdrawn ₹" + request.getAmount() + " from Account " + account.getAccountNumber());

        return savedTxn;
    }

    @Transactional
    public Transaction transfer(TransferRequest request) {
        Account sourceAccount = accountRepository.findByIdWithLock(request.getSourceAccountId())
                .orElseThrow(() -> new RuntimeException("Source account not found with ID: " + request.getSourceAccountId()));

        if (sourceAccount.getStatus() == Account.AccountStatus.FROZEN) {
            throw new RuntimeException("Source account is FROZEN. Outgoing transfers blocked.");
        }

        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance for transfer.");
        }

        // Find destination account by ID or Account Number
        Account destAccount = accountRepository.findById(request.getDestinationAccountId())
                .or(() -> accountRepository.findByAccountNumber(request.getDestinationAccountId()))
                .orElseThrow(() -> new RuntimeException("Destination beneficiary account not found: " + request.getDestinationAccountId()));

        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
        destAccount.setBalance(destAccount.getBalance().add(request.getAmount()));

        accountRepository.save(sourceAccount);
        accountRepository.save(destAccount);

        String ref = "TXN-TRF-" + System.currentTimeMillis();
        Transaction txn = Transaction.builder()
                .transactionReference(ref)
                .accountId(sourceAccount.getId())
                .accountNumber(sourceAccount.getAccountNumber())
                .customerName(sourceAccount.getCustomerName())
                .destinationAccountId(destAccount.getId())
                .destinationAccountNumber(destAccount.getAccountNumber())
                .type(Transaction.TransactionType.TRANSFER)
                .amount(request.getAmount())
                .balanceAfter(sourceAccount.getBalance())
                .status(Transaction.TransactionStatus.COMPLETED)
                .description(request.getDescription() != null ? request.getDescription() : "Funds Transfer to " + destAccount.getAccountNumber())
                .performedBy(request.getPerformedBy() != null ? request.getPerformedBy() : "USER")
                .idempotencyKey(request.getIdempotencyKey())
                .build();

        Transaction savedTxn = transactionRepository.save(txn);

        auditService.recordAudit("FUNDS_TRANSFER", "Account", sourceAccount.getId(), request.getPerformedBy(), "CUSTOMER",
                "Transferred ₹" + request.getAmount() + " from " + sourceAccount.getAccountNumber() + " to " + destAccount.getAccountNumber());

        return savedTxn;
    }

    public Account freezeAccount(String accountId, String reason, String performedBy) {
        Account account = getAccountById(accountId);
        account.setStatus(Account.AccountStatus.FROZEN);
        Account saved = accountRepository.save(account);

        auditService.recordAudit("ACCOUNT_FROZEN", "Account", accountId, performedBy, "SUPERVISOR",
                "Account frozen due to: " + reason);

        return saved;
    }

    public Account unfreezeAccount(String accountId, String reason, String performedBy) {
        Account account = getAccountById(accountId);
        account.setStatus(Account.AccountStatus.ACTIVE);
        Account saved = accountRepository.save(account);

        auditService.recordAudit("ACCOUNT_UNFROZEN", "Account", accountId, performedBy, "SUPERVISOR",
                "Account unfrozen after review: " + reason);

        return saved;
    }
}
