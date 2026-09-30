package com.fincore.controller;

import com.fincore.dto.ApiResponse;
import com.fincore.entity.Transaction;
import com.fincore.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Transaction>>> getAllTransactions(
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(required = false) String accountId) {
        
        List<Transaction> list;
        if (accountId != null && !accountId.isEmpty()) {
            list = transactionRepository.findByAccountIdOrderByCreatedAtDesc(accountId);
        } else {
            list = transactionRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit));
        }

        return ResponseEntity.ok(ApiResponse.ok("Transactions retrieved", list));
    }
}
