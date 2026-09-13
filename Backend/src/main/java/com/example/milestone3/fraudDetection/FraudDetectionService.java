package com.example.milestone3.fraudDetection;

import com.example.milestone3.audit.AuditLogService;
import com.example.milestone3.risk.RiskAssessment;
import com.example.milestone3.risk.RiskAssessmentRepo;
import com.example.milestone3.settlementEngine.entity.Loan;
import com.example.milestone3.settlementEngine.entity.Transaction;
import com.example.milestone3.settlementEngine.repo.LoanRepo;
import com.example.milestone3.settlementEngine.repo.TransactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.milestone3.operations.entity.Customer;
import com.example.milestone3.operations.repo.CustomerRepo;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FraudDetectionService {
    @Autowired
    private TransactionRepo transactionRepository;
    @Autowired
    private FraudEventRepo fraudEventRepository;
    @Autowired
    private LoanRepo loanRepo;
    @Autowired
    private RiskAssessmentRepo riskAssessmentRepo;
    @Autowired
    private AuditLogService auditLogService;
    @Autowired
    private CustomerRepo customerRepo;

    public record FraudResult(
            int score,
            String status,
            List<String> reasons
    ) { }

    public record FraudEvaluationRequest(
            Long customerId,
            String customerName,
            BigDecimal amount,
            String transactionType,
            String location,
            String deviceIp,
            Integer failedAttempts,
            Integer recentTxnCount,
            Boolean isNewDevice,
            Boolean isInternational,
            Boolean isUnusualTime
    ) { }

    public record FraudEvaluationResponse(
            Long eventId,
            Long transactionId,
            String transactionReference,
            Long customerId,
            String customerName,
            BigDecimal amount,
            String transactionType,
            String location,
            String deviceIp,
            int score,
            String threatLevel,
            String status,
            List<String> reasons,
            String createdAt
    ) { }


    public FraudResult checkTransaction(Transaction transaction) {

        int score = 0;

        List<String> reasons = new ArrayList<>();
        Loan loan = loanRepo
                .findById(transaction.getLoanId())
                .orElseThrow(() ->
                        new RuntimeException("Loan not found"));

        Long userId = loan.getCustomerId();


        if (transaction.getAmount()
                .compareTo(new BigDecimal("100000")) >= 0) {

            score += 30;

            reasons.add("Large transaction amount");
        }


        long recentTransactions =
                transactionRepository.countRecentTransactions(
                        userId,
                        LocalDateTime.now().minusMinutes(5)
                );

        if (recentTransactions >= 5) {

            score += 25;

            reasons.add(
                    "Too many transactions in short time"
            );
        }

        String fraudStatus;

        if (score >= 80) {
            fraudStatus = "BLOCKED";

        } else if (score >= 50) {
            fraudStatus = "UNDER_REVIEW";

        } else if (score >= 25) {
            fraudStatus = "SUSPICIOUS";

        } else {
            fraudStatus = "SAFE";
        }

        return new FraudResult(
                score,
                fraudStatus,
                reasons
        );
    }

    public void saveFraudEvent(
            Transaction transaction,
            FraudResult result) {
        Loan loan = loanRepo
                .findById(transaction.getLoanId())
                .orElseThrow(() ->
                        new RuntimeException("Loan not found"));

        Long userId = loan.getCustomerId();

        FraudEvent fraudEvent = new FraudEvent();

        fraudEvent.setUserId(
                userId
        );

        fraudEvent.setTransactionId(
                transaction.getId()
        );

        fraudEvent.setFraudScore(
                result.score()
        );

        fraudEvent.setStatus(
                result.status()
        );

        fraudEvent.setReason(
                String.join(", ", result.reasons())
        );

        fraudEvent.setCreatedAt(
                LocalDateTime.now()
        );

        fraudEventRepository.save(fraudEvent);

        riskAssessmentRepo.save(new RiskAssessment(
                null,
                userId,
                transaction.getId(),
                result.score(),
                result.status(),
                String.join(", ", result.reasons()),
                LocalDateTime.now()
        ));

        auditLogService.record(
                "RISK_ENGINE",
                "RISK_ASSESSMENT_CREATED",
                "TRANSACTION",
                transaction.getId().toString(),
                "Decision " + result.status() + ", score " + result.score(),
                null
        );
    }

    @Transactional
    public FraudEvaluationResponse evaluateAndSave(FraudEvaluationRequest req) {
        Long customerId = (req.customerId() != null && req.customerId() > 0) ? req.customerId() : 1L;
        String customerName = (req.customerName() != null && !req.customerName().trim().isEmpty())
                ? req.customerName().trim()
                : "Customer #" + customerId;

        BigDecimal amount = req.amount() != null ? req.amount() : BigDecimal.ZERO;
        String txnType = (req.transactionType() != null && !req.transactionType().trim().isEmpty())
                ? req.transactionType().trim().toUpperCase()
                : "TRANSFER";
        String location = (req.location() != null && !req.location().trim().isEmpty())
                ? req.location().trim()
                : "Mumbai, IN";
        String deviceIp = (req.deviceIp() != null && !req.deviceIp().trim().isEmpty())
                ? req.deviceIp().trim()
                : "192.168.1.101";
        int failedAttempts = req.failedAttempts() != null ? req.failedAttempts() : 0;
        int recentTxnCount = req.recentTxnCount() != null ? req.recentTxnCount() : 1;
        boolean isNewDevice = Boolean.TRUE.equals(req.isNewDevice());
        boolean isInternational = Boolean.TRUE.equals(req.isInternational())
                || location.toLowerCase().contains("london")
                || location.toLowerCase().contains("york")
                || location.toLowerCase().contains("lagos")
                || location.toLowerCase().contains("dubai")
                || location.toLowerCase().contains("singapore")
                || location.toLowerCase().contains("international");
        boolean isUnusualTime = Boolean.TRUE.equals(req.isUnusualTime());

        int score = 0;
        List<String> reasons = new ArrayList<>();

        if (amount.compareTo(new BigDecimal("500000")) >= 0) {
            score += 35;
            reasons.add("Critical high-value transfer spike (>= ₹5,00,000 threshold)");
        } else if (amount.compareTo(new BigDecimal("100000")) >= 0) {
            score += 25;
            reasons.add("High-value transaction amount (>= ₹1,00,000 threshold)");
        } else if (amount.compareTo(new BigDecimal("50000")) >= 0) {
            score += 10;
            reasons.add("Moderate-value transaction (>= ₹50,000)");
        }

        if ("INTERNATIONAL_WIRE".equalsIgnoreCase(txnType) || "CRYPTO_EXCHANGE".equalsIgnoreCase(txnType)) {
            score += 25;
            reasons.add("High-risk transfer category (" + txnType + ")");
        }

        if (isInternational) {
            score += 25;
            reasons.add("Cross-border / geofence anomaly flagged from " + location);
        }

        if (isNewDevice) {
            score += 15;
            reasons.add("Unregistered device hardware signature & IP (" + deviceIp + ")");
        }

        if (failedAttempts >= 3) {
            score += 20;
            reasons.add("Multiple consecutive failed 2FA/PIN attempts (" + failedAttempts + " attempts)");
        } else if (failedAttempts > 0) {
            score += (5 * failedAttempts);
            reasons.add("Failed authentication attempts recorded (" + failedAttempts + " attempts)");
        }

        if (recentTxnCount >= 5) {
            score += 25;
            reasons.add("High transaction velocity frequency (" + recentTxnCount + " rapid transactions in window)");
        } else if (recentTxnCount >= 3) {
            score += 15;
            reasons.add("Elevated transaction velocity (" + recentTxnCount + " transactions in window)");
        }

        if (isUnusualTime) {
            score += 10;
            reasons.add("Off-hours / unusual timestamp window (2:00 AM - 4:00 AM)");
        }

        if (reasons.isEmpty()) {
            reasons.add("Transaction matches customer standard baseline activity");
        }

        if (score > 100) score = 100;

        String fraudStatus;
        String threatLevel;
        if (score >= 75) {
            fraudStatus = "BLOCKED";
            threatLevel = "CRITICAL";
        } else if (score >= 50) {
            fraudStatus = "UNDER_REVIEW";
            threatLevel = "HIGH";
        } else if (score >= 25) {
            fraudStatus = "SUSPICIOUS";
            threatLevel = "MEDIUM";
        } else {
            fraudStatus = "SAFE";
            threatLevel = "LOW";
        }

        // 1. Create and persist Transaction in database
        Transaction txn = new Transaction();
        txn.setCustomerId(customerId);
        txn.setLoanId(1L);
        int randSuffix = (int)(Math.random() * 9000 + 1000);
        txn.setTransactionReference("TXN-2026-" + randSuffix);
        txn.setAmount(amount);
        txn.setType(txnType);
        txn.setStatus("BLOCKED".equalsIgnoreCase(fraudStatus) ? "FAILED" : "SUCCESS");
        txn.setCreatedAt(LocalDateTime.now());
        Transaction savedTxn = transactionRepository.save(txn);

        // 2. Create and persist FraudEvent in database
        String combinedReasons = String.join("; ", reasons);
        FraudEvent fraudEvent = new FraudEvent();
        fraudEvent.setUserId(customerId);
        fraudEvent.setTransactionId(savedTxn.getId());
        fraudEvent.setFraudScore(score);
        fraudEvent.setStatus(fraudStatus);
        fraudEvent.setReason(combinedReasons.length() > 250 ? combinedReasons.substring(0, 247) + "..." : combinedReasons);
        fraudEvent.setCreatedAt(LocalDateTime.now());
        FraudEvent savedEvent = fraudEventRepository.save(fraudEvent);

        // 3. Save RiskAssessment in database
        RiskAssessment ra = new RiskAssessment(
                null,
                customerId,
                savedTxn.getId(),
                score,
                fraudStatus,
                combinedReasons.length() > 250 ? combinedReasons.substring(0, 247) + "..." : combinedReasons,
                LocalDateTime.now()
        );
        ra.setCustomerName(customerName);
        ra.setAmount(amount);
        ra.setTransactionType(txnType);
        ra.setLocation(location);
        ra.setDeviceType(isNewDevice ? "NEW_DEVICE" : "TRUSTED_DEVICE");
        ra.setInternationalTransaction(isInternational);
        ra.setNewDevice(isNewDevice);
        ra.setFailedAttempts(failedAttempts);
        ra.setRiskLevel(threatLevel);
        ra.setAssessmentStatus("EVALUATED");
        riskAssessmentRepo.save(ra);

        // 4. Record in Audit Log
        auditLogService.record(
                null,
                "FRAUD_ENGINE",
                "FRAUD_EVALUATION_COMPLETED",
                "FRAUD_DETECTION",
                "TRANSACTION",
                savedTxn.getTransactionReference(),
                "Evaluation complete: Score " + score + "/100 (" + fraudStatus + ") for customer " + customerName,
                "BLOCKED".equalsIgnoreCase(fraudStatus) ? "FAILED" : "SUCCESS",
                null
        );

        return new FraudEvaluationResponse(
                savedEvent.getId(),
                savedTxn.getId(),
                savedTxn.getTransactionReference(),
                customerId,
                customerName,
                amount,
                txnType,
                location,
                deviceIp,
                score,
                threatLevel,
                fraudStatus,
                reasons,
                savedEvent.getCreatedAt().toString()
        );
    }
}
