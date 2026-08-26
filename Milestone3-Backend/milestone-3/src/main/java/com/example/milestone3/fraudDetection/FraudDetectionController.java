package com.example.milestone3.fraudDetection;

import com.example.milestone3.settlementEngine.entity.Transaction;
import com.example.milestone3.settlementEngine.repo.TransactionRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/fraud")
@RequiredArgsConstructor
public class FraudDetectionController {
    @Autowired
    private FraudDetectionService fraudDetectionService;
    @Autowired
    private TransactionRepo transactionRepository;
    @Autowired
    private FraudEventRepo fraudEventRepository;

    @GetMapping("/events")
    public ResponseEntity<List<FraudEvent>> getAllEvents() {
        return ResponseEntity.ok(fraudEventRepository.findAll());
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionRepository.findAll());
    }

    @PostMapping("/check/{transactionId}")
    public ResponseEntity<FraudDetectionService.FraudResult> checkTransaction(
            @PathVariable Long transactionId) {

        Transaction transaction = transactionRepository
                .findById(transactionId)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found"));

        FraudDetectionService.FraudResult result =
                fraudDetectionService.checkTransaction(transaction);

        fraudDetectionService.saveFraudEvent(
                transaction,
                result
        );

        return ResponseEntity.ok(result);
    }
}