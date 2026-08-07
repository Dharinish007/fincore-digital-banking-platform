package com.fincore.BankingManagement.service;

import com.fincore.BankingManagement.dto.TransactionDto;
import com.fincore.BankingManagement.dto.TransferRequest;
import com.fincore.BankingManagement.dto.TransferResponse;
import com.fincore.BankingManagement.exception.InsufficientBalanceException;
import com.fincore.BankingManagement.exception.ResourceNotFoundException;
import com.fincore.BankingManagement.model.Account;
import com.fincore.BankingManagement.model.AuditLog;
import com.fincore.BankingManagement.model.Transaction;
import com.fincore.BankingManagement.repository.AccountRepository;
import com.fincore.BankingManagement.repository.AuditLogRepository;
import com.fincore.BankingManagement.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    public List<TransactionDto> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAll();

        if (transactions.isEmpty()) {
            seedSampleTransactions();
            transactions = transactionRepository.findAll();
        }

        List<TransactionDto> dtos = new ArrayList<>();
        for (Transaction tx : transactions) {
            dtos.add(mapToDto(tx));
        }
        return dtos;
    }

    @Override
    public TransactionDto getTransactionById(String id) {
        Transaction tx = transactionRepository.findByTransactionCode(id)
                .orElseGet(() -> transactionRepository.findByReference(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID or Reference: " + id)));
        return mapToDto(tx);
    }

    @Override
    @Transactional
    public TransferResponse transferFunds(TransferRequest request) {
        String generatedTxCode = "TX" + (100000 + new Random().nextInt(900000));

        Account sender = accountRepository.findByAccountNo(request.getSender()).orElse(null);
        Account receiver = accountRepository.findByAccountNo(request.getReceiver()).orElse(null);

        BigDecimal amount = request.getAmount() != null ? request.getAmount() : BigDecimal.ZERO;
        BigDecimal charges = amount.compareTo(new BigDecimal("10000")) > 0 ? new BigDecimal("15.00") : new BigDecimal("5.00");

        if (sender != null && sender.getBalance().compareTo(amount.add(charges)) < 0) {
            Transaction failedTx = new Transaction();
            failedTx.setTransactionCode(generatedTxCode);
            failedTx.setSenderAccountNo(request.getSender());
            failedTx.setSenderName(sender.getCustomer() != null ? sender.getCustomer().getFullName() : "Sender");
            failedTx.setReceiverAccountNo(request.getReceiver());
            failedTx.setReceiverName(receiver != null && receiver.getCustomer() != null ? receiver.getCustomer().getFullName() : "Receiver");
            failedTx.setTransactionType(request.getType() != null ? request.getType() : "Transfer");
            failedTx.setAmount(amount);
            failedTx.setCharges(charges);
            failedTx.setReference(request.getReference() != null ? request.getReference() : "REF" + new Random().nextInt(900000));
            failedTx.setStatus("Failed");
            failedTx.setFailureReason("INSUFFICIENT_FUNDS: Available balance is lower than transfer total including fee.");
            failedTx.setDescription(request.getDescription());
            transactionRepository.save(failedTx);

            throw new InsufficientBalanceException("Insufficient sender account balance for transfer.");
        }

        // Execute Two-Phase Commit Transfer Simulation
        if (sender != null) {
            sender.setBalance(sender.getBalance().subtract(amount.add(charges)));
            sender.setAvailableBalance(sender.getBalance());
            sender.setSystemCalculatedBalance(sender.getBalance());
            accountRepository.save(sender);
        }

        if (receiver != null) {
            receiver.setBalance(receiver.getBalance().add(amount));
            receiver.setAvailableBalance(receiver.getBalance());
            receiver.setSystemCalculatedBalance(receiver.getBalance());
            accountRepository.save(receiver);
        }

        Transaction tx = new Transaction();
        tx.setTransactionCode(generatedTxCode);
        tx.setSenderAccountNo(request.getSender());
        tx.setSenderName(sender != null && sender.getCustomer() != null ? sender.getCustomer().getFullName() : "Sender");
        tx.setReceiverAccountNo(request.getReceiver());
        tx.setReceiverName(receiver != null && receiver.getCustomer() != null ? receiver.getCustomer().getFullName() : "Receiver");
        tx.setTransactionType(request.getType() != null ? request.getType() : "Transfer");
        tx.setAmount(amount);
        tx.setCharges(charges);
        tx.setReference(request.getReference() != null ? request.getReference() : "REF" + new Random().nextInt(900000));
        tx.setStatus("Success");
        tx.setDescription(request.getDescription());
        tx = transactionRepository.save(tx);

        // Record Audit Log
        AuditLog log = new AuditLog();
        log.setAccountNo(request.getSender());
        log.setLogLevel("SUCCESS");
        log.setEventAction("TRANSFER_COMMITTED");
        log.setPerformedBy("ATOMIC_ENGINE");
        log.setRemarks("Transfer of $" + amount + " committed from " + request.getSender() + " to " + request.getReceiver());
        auditLogRepository.save(log);

        return TransferResponse.builder()
                .id(tx.getTransactionCode())
                .status("Success")
                .amount(tx.getAmount())
                .senderBalance(sender != null ? sender.getBalance() : BigDecimal.ZERO)
                .date(tx.getTransactionDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .reference(tx.getReference())
                .build();
    }

    @Override
    @Transactional
    public TransactionDto retryTransaction(String id) {
        Transaction tx = transactionRepository.findByTransactionCode(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found to retry: " + id));

        tx.setStatus("Success");
        tx.setFailureReason(null);
        tx = transactionRepository.save(tx);

        return mapToDto(tx);
    }

    private TransactionDto mapToDto(Transaction tx) {
        String dateStr = tx.getTransactionDate() != null
                ? tx.getTransactionDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        return TransactionDto.builder()
                .id(tx.getTransactionCode())
                .sender(tx.getSenderAccountNo())
                .senderName(tx.getSenderName())
                .receiver(tx.getReceiverAccountNo())
                .receiverName(tx.getReceiverName())
                .type(tx.getTransactionType())
                .amount(tx.getAmount())
                .date(dateStr)
                .reference(tx.getReference())
                .status(tx.getStatus())
                .failureReason(tx.getFailureReason())
                .description(tx.getDescription())
                .charges(tx.getCharges())
                .build();
    }

    private void seedSampleTransactions() {
        Transaction t1 = new Transaction(null, "TX100981", "100084920192", "Aditi Verma", "400092817261", "Apex Logistics Ltd", "Transfer", new BigDecimal("24500.00"), new BigDecimal("15.00"), "REF892019", "Success", null, "Vendor payment for Q3 software license renewal", LocalDateTime.now().minusMinutes(30));
        Transaction t2 = new Transaction(null, "TX100982", "200039102938", "Rahul Sharma", "100084920192", "Aditi Verma", "Deposit", new BigDecimal("150000.00"), BigDecimal.ZERO, "REF892020", "Success", null, "Salary credit for July 2026", LocalDateTime.now().minusMinutes(120));
        Transaction t3 = new Transaction(null, "TX100984", "300091827364", "Global Tech Corp", "100084920192", "Aditi Verma", "Transfer", new BigDecimal("8750.50"), BigDecimal.ZERO, "REF892022", "Failed", "INSUFFICIENT_FUNDS_ATOMIC_ROLLBACK: Debit account locked due to concurrent transaction lock", "Quarterly dividend payout", LocalDateTime.now().minusMinutes(720));

        transactionRepository.save(t1);
        transactionRepository.save(t2);
        transactionRepository.save(t3);
    }
}
