package com.fincore.transaction.controller;

import com.fincore.transaction.dto.*;
import com.fincore.transaction.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(@Valid @RequestBody DepositRequest request) {
        return ResponseEntity.ok(transactionService.deposit(request));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(@Valid @RequestBody WithdrawRequest request) {
        return ResponseEntity.ok(transactionService.withdraw(request));
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(@Valid @RequestBody TransferRequest request) {
        return ResponseEntity.ok(transactionService.transfer(request));
    }

    @GetMapping("/statistics")
    public ResponseEntity<TransactionStatisticsResponse> getStatistics() {
        return ResponseEntity.ok(transactionService.getStatistics());
    }

    @GetMapping("/recent")
    public ResponseEntity<Page<TransactionResponse>> getRecentTransactions(
            @RequestParam(defaultValue = "10") int limit) {

        return ResponseEntity.ok(
                transactionService.getRecentTransactions(limit)
        );
    }

    @GetMapping
    public ResponseEntity<Page<TransactionResponse>> getAllTransactions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) java.math.BigDecimal minAmount,
            @RequestParam(required = false) java.math.BigDecimal maxAmount,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(transactionService.getAllTransactions(
                search, type, status, minAmount, maxAmount, startDate, endDate, pageable
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable String id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Page<TransactionResponse>> getTransactionsByCustomerId(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(transactionService.getTransactionsByCustomerId(customerId, pageable));
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request) {
        return ResponseEntity.ok(transactionService.createTransaction(request));
    }

    @GetMapping("/history")
    public ResponseEntity<Page<TransactionResponse>> getHistoryByQueryParam(
            @RequestParam(required = false) String accountId,
            @RequestParam(required = false) String accountNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String targetAcc = accountNumber != null ? accountNumber : accountId;
        if (targetAcc == null || targetAcc.trim().isEmpty()) {
            return ResponseEntity.ok(transactionService.getAllTransactions(null, null, null, null, null, null, null, PageRequest.of(page, size)));
        }
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(transactionService.getHistory(targetAcc.trim(), pageable));
    }

    @GetMapping("/history/{accountNumber}")
    public ResponseEntity<Page<TransactionResponse>> getHistory(
            @PathVariable String accountNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(transactionService.getHistory(accountNumber, pageable));
    }
}
