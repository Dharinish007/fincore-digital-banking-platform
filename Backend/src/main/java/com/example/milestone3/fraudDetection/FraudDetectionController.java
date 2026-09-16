package com.example.milestone3.fraudDetection;

import com.example.milestone3.audit.AuditLogService;
import com.example.milestone3.settlementEngine.entity.Transaction;
import com.example.milestone3.settlementEngine.repo.TransactionRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/events")
    public ResponseEntity<List<FraudEvent>> getAllEvents() {
        return ResponseEntity.ok(fraudEventRepository.findAllByOrderByIdDesc());
    }

    @GetMapping("/recent-events")
    public ResponseEntity<List<FraudEvent>> getRecentEvents() {
        return ResponseEntity.ok(fraudEventRepository.findTop10ByOrderByIdDesc());
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

        String status = "BLOCKED".equalsIgnoreCase(result.status()) ? "FAILED" : "SUCCESS";
        auditLogService.record(null, "FRAUD_ENGINE", "FRAUD_CHECK_EVALUATED", "FRAUD_DETECTION",
                "TRANSACTION", transactionId.toString(),
                "AI anomaly check completed. Risk score: " + result.score() + "/100 (" + result.status() + ")",
                status, null);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/evaluate")
    public ResponseEntity<FraudDetectionService.FraudEvaluationResponse> evaluateTransaction(
            @RequestBody FraudDetectionService.FraudEvaluationRequest request) {
        FraudDetectionService.FraudEvaluationResponse response =
                fraudDetectionService.evaluateAndSave(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/decision/approve/{transactionId}")
    public ResponseEntity<?> approveHold(@PathVariable Long transactionId) {
        Transaction txn = fraudDetectionService.approveHold(transactionId);
        return ResponseEntity.ok(Map.of(
                "message", "Transaction #" + txn.getTransactionReference() + " approved and settled successfully.",
                "transaction", txn
        ));
    }

    @PostMapping("/decision/block/{transactionId}")
    public ResponseEntity<?> blockHold(@PathVariable Long transactionId, @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : "Blocked by Fraud Officer";
        Transaction txn = fraudDetectionService.blockHold(transactionId, reason);
        return ResponseEntity.ok(Map.of(
                "message", "Transaction #" + txn.getTransactionReference() + " has been blocked.",
                "transaction", txn
        ));
    }

    @PostMapping("/decision/escalate/{transactionId}")
    public ResponseEntity<?> escalateCase(@PathVariable Long transactionId, @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : "Escalated to AML Level 3";
        Transaction txn = fraudDetectionService.escalateCase(transactionId, reason);
        return ResponseEntity.ok(Map.of(
                "message", "Transaction #" + txn.getTransactionReference() + " escalated to Level-3 AML team.",
                "transaction", txn
        ));
    }
}