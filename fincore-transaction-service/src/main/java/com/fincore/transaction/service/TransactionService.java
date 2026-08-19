package com.fincore.transaction.service;

import com.fincore.transaction.dto.*;
import com.fincore.transaction.entity.*;
import com.fincore.transaction.exception.AccountNotActiveException;
import com.fincore.transaction.exception.AccountNotFoundException;
import com.fincore.transaction.exception.InsufficientBalanceException;
import com.fincore.transaction.repository.AccountRepository;
import com.fincore.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Core Transaction Service.
 *
 * No Kafka / event streaming here by design - every operation is a plain
 * synchronous REST call that:
 *   1. Locks the account row (pessimistic write lock) so concurrent requests
 *      on the same account cannot race each other -> transaction atomicity.
 *   2. Validates business rules (sufficient balance, account status).
 *   3. Updates the balance and persists an immutable Transaction audit record
 *      in the SAME database transaction, so either both succeed or both roll
 *      back together (no "money moved but no audit row" scenario).
 */
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public TransactionResponse deposit(DepositRequest request) {
        Account account = lockActiveAccount(request.getAccountNumber());

        BigDecimal newBalance = account.getBalance().add(request.getAmount());
        account.setBalance(newBalance);
        accountRepository.save(account);

        Transaction tx = Transaction.builder()
                .referenceId(newReferenceId())
                .accountNumber(account.getAccountNumber())
                .type(TransactionType.DEPOSIT)
                .amount(request.getAmount())
                .balanceAfter(newBalance)
                .status(TransactionStatus.SUCCESS)
                .remarks(request.getRemarks())
                .build();

        return TransactionResponse.from(transactionRepository.save(tx));
    }

    @Transactional
    public TransactionResponse withdraw(WithdrawRequest request) {
        Account account = lockActiveAccount(request.getAccountNumber());

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            // Log the failed attempt too, for a complete audit trail.
            transactionRepository.save(Transaction.builder()
                    .referenceId(newReferenceId())
                    .accountNumber(account.getAccountNumber())
                    .type(TransactionType.WITHDRAWAL)
                    .amount(request.getAmount())
                    .balanceAfter(account.getBalance())
                    .status(TransactionStatus.FAILED)
                    .remarks("Insufficient balance")
                    .build());
            throw new InsufficientBalanceException(account.getAccountNumber());
        }

        BigDecimal newBalance = account.getBalance().subtract(request.getAmount());
        account.setBalance(newBalance);
        accountRepository.save(account);

        Transaction tx = Transaction.builder()
                .referenceId(newReferenceId())
                .accountNumber(account.getAccountNumber())
                .type(TransactionType.WITHDRAWAL)
                .amount(request.getAmount())
                .balanceAfter(newBalance)
                .status(TransactionStatus.SUCCESS)
                .remarks(request.getRemarks())
                .build();

        return TransactionResponse.from(transactionRepository.save(tx));
    }

    @Transactional
    public TransactionResponse transfer(TransferRequest request) {
        if (request.getFromAccountNumber().equals(request.getToAccountNumber())) {
            throw new IllegalArgumentException("fromAccountNumber and toAccountNumber must differ");
        }

        // Lock both accounts in a deterministic order (alphabetical by account
        // number) to avoid deadlocks when two transfers happen in opposite
        // directions at the same time.
        String first = request.getFromAccountNumber().compareTo(request.getToAccountNumber()) < 0
                ? request.getFromAccountNumber() : request.getToAccountNumber();
        String second = first.equals(request.getFromAccountNumber())
                ? request.getToAccountNumber() : request.getFromAccountNumber();

        Account firstLocked = lockActiveAccount(first);
        Account secondLocked = lockActiveAccount(second);

        Account fromAccount = firstLocked.getAccountNumber().equals(request.getFromAccountNumber()) ? firstLocked : secondLocked;
        Account toAccount = firstLocked.getAccountNumber().equals(request.getToAccountNumber()) ? firstLocked : secondLocked;

        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            transactionRepository.save(Transaction.builder()
                    .referenceId(newReferenceId())
                    .accountNumber(fromAccount.getAccountNumber())
                    .counterpartyAccountNumber(toAccount.getAccountNumber())
                    .type(TransactionType.TRANSFER_OUT)
                    .amount(request.getAmount())
                    .balanceAfter(fromAccount.getBalance())
                    .status(TransactionStatus.FAILED)
                    .remarks("Insufficient balance")
                    .build());
            throw new InsufficientBalanceException(fromAccount.getAccountNumber());
        }

        fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
        toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        String sharedRef = newReferenceId();

        transactionRepository.save(Transaction.builder()
                .referenceId(sharedRef + "-OUT")
                .accountNumber(fromAccount.getAccountNumber())
                .counterpartyAccountNumber(toAccount.getAccountNumber())
                .type(TransactionType.TRANSFER_OUT)
                .amount(request.getAmount())
                .balanceAfter(fromAccount.getBalance())
                .status(TransactionStatus.SUCCESS)
                .remarks(request.getRemarks())
                .build());

        Transaction inTx = transactionRepository.save(Transaction.builder()
                .referenceId(sharedRef + "-IN")
                .accountNumber(toAccount.getAccountNumber())
                .counterpartyAccountNumber(fromAccount.getAccountNumber())
                .type(TransactionType.TRANSFER_IN)
                .amount(request.getAmount())
                .balanceAfter(toAccount.getBalance())
                .status(TransactionStatus.SUCCESS)
                .remarks(request.getRemarks())
                .build());

        return TransactionResponse.from(inTx);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getHistory(String accountNumber, Pageable pageable) {
        if (!accountRepository.existsByAccountNumber(accountNumber)) {
            throw new AccountNotFoundException(accountNumber);
        }
        return transactionRepository.findByAccountNumberOrderByCreatedAtDesc(accountNumber, pageable)
                .map(TransactionResponse::from);
    }

    private Account lockActiveAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumberForUpdate(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));
        if (!"ACTIVE".equals(account.getStatus())) {
            throw new AccountNotActiveException(accountNumber, account.getStatus());
        }
        return account;
    }

    private String newReferenceId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }
}
