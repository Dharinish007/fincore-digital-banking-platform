package com.example.milestone3.risk;

import com.example.milestone3.audit.AuditLogService;
import com.example.milestone3.operations.repo.AccountRepo;
import com.example.milestone3.operations.repo.CustomerRepo;
import com.example.milestone3.settlementEngine.entity.Loan;
import com.example.milestone3.settlementEngine.entity.Transaction;
import com.example.milestone3.settlementEngine.repo.LoanRepo;
import com.example.milestone3.settlementEngine.repo.TransactionRepo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping({"/api/risk-assessments", "/api/risk"})
@RequiredArgsConstructor
public class RiskAssessmentController {

    private final RiskAssessmentRepo repository;
    private final TransactionRepo transactionRepository;
    private final LoanRepo loanRepository;
    private final AccountRepo accountRepository;
    private final CustomerRepo customerRepository;
    private final RiskAssessmentService riskAssessmentService;
    private final AuditLogService auditLogService;

    /** All stored transactions (formatted for the assessment picker). */
    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionRiskOption>> transactions() {
        List<TransactionRiskOption> options = transactionRepository.findTop5ByOrderByCreatedAtDescIdDesc().stream()
                .map(transaction -> new TransactionRiskOption(transaction.getId(),
                        customerIdFor(transaction),
                        transaction.getAmount(), transaction.getType(), transaction.getStatus(), transaction.getCreatedAt()))
                .toList();
        return ResponseEntity.ok(options);
    }

    private Long customerIdFor(Transaction transaction) {
        if (transaction.getCustomerId() != null) {
            return transaction.getCustomerId();
        }
        if (transaction.getLoanId() == null) {
            return null;
        }
        return loanRepository.findById(transaction.getLoanId()).map(Loan::getCustomerId).orElse(null);
    }

    /**
     * Transaction history of a single customer, used for additional analysis
     * and shown on the risk assessment dashboard.
     */
    @GetMapping("/transactions/{customerId}")
    public ResponseEntity<List<Transaction>> customerTransactions(@PathVariable Long customerId) {
        return ResponseEntity.ok(transactionRepository.findTransactionsByCustomerId(customerId));
    }

    /**
     * Full customer context (customer, accounts, loans and transaction
     * history) so the dashboard can pre-fill and display the data that is
    * later used by the rule-based assessment.
     */
    @GetMapping("/customers/{customerId}/profile")
    public ResponseEntity<Map<String, Object>> customerProfile(@PathVariable Long customerId) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("customer", customerRepository.findById(customerId).orElse(null));
        profile.put("accounts", accountRepository.findByCustomerId(customerId));
        profile.put("loans", loanRepository.findByCustomerId(customerId));
        profile.put("transactions", transactionRepository.findTransactionsByCustomerId(customerId));
        return ResponseEntity.ok(profile);
    }

    /** Calculates the rule-based risk assessment and persists the result. */
    @PostMapping("/assess")
    public ResponseEntity<RiskAssessment> assess(@Valid @RequestBody RiskRequest request) {
        RiskAssessment saved = riskAssessmentService.assess(request);
        auditLogService.record("RISK_ENGINE", "RISK_ASSESSMENT_CREATED", "RISK_ASSESSMENT",
                saved.getId().toString(),
                "Rule-based risk " + saved.getRiskLevel() + " (source " + saved.getAnalysisSource()
                        + "), decision " + saved.getDecision(),
                null);
        if (saved.getRiskScore() != null && saved.getRiskScore() >= 60) {
            auditLogService.record("RISK_ENGINE", "HIGH_RISK_TRANSACTION", "RISK_ASSESSMENT",
                    saved.getId().toString(), "AI risk score " + saved.getRiskScore(), null);
        }
        return ResponseEntity.ok(saved);
    }

    /** Saved assessment history. */
    @GetMapping
    public ResponseEntity<List<RiskAssessment>> getAll() {
        return ResponseEntity.ok(repository.findAllByOrderByAssessedAtDesc());
    }

    public record RiskRequest(
            @NotNull Long customerId,
            Long transactionId,
            @NotNull @Positive BigDecimal amount,
            @NotBlank String transactionType,
            @NotBlank String location,
            @NotBlank String deviceType,
            boolean internationalTransaction,
            boolean newDevice,
            int failedAttempts,
            boolean unusualBehavior,
            // ---- Financial & risk inputs supplied through the dashboard ----
            BigDecimal annualIncome,
            BigDecimal accountBalance,
            String accountType,
            String accountNumber,
            String employmentStatus,
            BigDecimal loanOutstanding,
            Integer loanCount,
            String transactionPattern,
            String depositFrequency
    ) { }

    public record TransactionRiskOption(Long transactionId, Long customerId, BigDecimal amount,
                                        String transactionType, String status, LocalDateTime createdAt) { }
}