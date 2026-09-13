package com.example.milestone3.risk;

import com.example.milestone3.operations.repo.AccountRepo;
import com.example.milestone3.operations.repo.CustomerRepo;
import com.example.milestone3.settlementEngine.entity.Loan;
import com.example.milestone3.settlementEngine.entity.Transaction;
import com.example.milestone3.settlementEngine.repo.LoanRepo;
import com.example.milestone3.settlementEngine.repo.TransactionRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Orchestrates a deterministic risk assessment:
 * <ol>
 *   <li>persists the dashboard-entered financial / loan / transaction inputs,</li>
 *   <li>retrieves the customer's transaction history from the database,</li>
 *   <li>analyzes the collected data with explicit banking risk rules,</li>
 *   <li>persists the final score, level, analysis and timestamp.</li>
 * </ol>
 * Every completed assessment is persisted with its factors and transaction snapshot.
 */
@Service
@RequiredArgsConstructor
public class RiskAssessmentService {

    private final RiskAssessmentRepo repository;
    private final TransactionRepo transactionRepository;
    private final LoanRepo loanRepository;
    private final AccountRepo accountRepository;
    private final CustomerRepo customerRepository;
    public RiskAssessment assess(RiskAssessmentController.RiskRequest request) {
        RiskAssessment assessment = new RiskAssessment();
        assessment.setCustomerId(request.customerId());
        assessment.setTransactionId(request.transactionId());
        assessment.setAmount(request.amount());
        assessment.setTransactionType(request.transactionType());
        assessment.setLocation(request.location());
        assessment.setDeviceType(request.deviceType());
        assessment.setInternationalTransaction(request.internationalTransaction());
        assessment.setNewDevice(request.newDevice());
        assessment.setFailedAttempts(request.failedAttempts());
        assessment.setUnusualBehavior(request.unusualBehavior());

        // Directly entered financial / risk-related factors
        assessment.setAnnualIncome(request.annualIncome());
        assessment.setAccountBalance(request.accountBalance());
        assessment.setAccountType(request.accountType());
        assessment.setAccountNumber(request.accountNumber());
        assessment.setEmploymentStatus(request.employmentStatus());
        assessment.setLoanOutstanding(request.loanOutstanding());
        assessment.setLoanCount(request.loanCount());
        assessment.setTransactionPattern(request.transactionPattern());
        assessment.setDepositFrequency(request.depositFrequency());

        enrichFromCustomerData(request, assessment);

        // Retrieve the customer's transaction history for additional analysis
        List<Transaction> history = transactionRepository.findTransactionsByCustomerId(request.customerId());
        assessment.setPreviousTransactionCount(history.size());
        assessment.setTransactionHistory(history.stream()
            .map(transaction -> "#" + transaction.getId() + " amount=" + transaction.getAmount()
                + " type=" + transaction.getType() + " status=" + transaction.getStatus())
            .reduce((left, right) -> left + "; " + right)
            .orElse("No transaction history"));

        applyRuleBasedAssessment(assessment, history);

        assessment.setAssessmentStatus("COMPLETED");
        assessment.setAssessedAt(LocalDateTime.now());
        return repository.save(assessment);
    }

    /**
     * Fills any missing financial / account / loan fields from the persisted
     * customer, account and loan records.
     */
    private void enrichFromCustomerData(RiskAssessmentController.RiskRequest request, RiskAssessment assessment) {
        customerRepository.findById(request.customerId())
                .ifPresent(customer -> assessment.setCustomerName(customer.getFullName()));

        accountRepository.findByCustomerId(request.customerId()).stream().findFirst().ifPresent(account -> {
            if (assessment.getAccountNumber() == null || assessment.getAccountNumber().isBlank()) {
                assessment.setAccountNumber(account.getAccountNumber());
            }
            if (assessment.getAccountType() == null || assessment.getAccountType().isBlank()) {
                assessment.setAccountType(account.getAccountType());
            }
            if (assessment.getAccountBalance() == null) {
                assessment.setAccountBalance(account.getBalance());
            }
        });

        List<Loan> loans = loanRepository.findByCustomerId(request.customerId());
        if (!loans.isEmpty()) {
            BigDecimal outstanding = loans.stream()
                    .map(Loan::getTotalOutstanding)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            if (assessment.getLoanOutstanding() == null) {
                assessment.setLoanOutstanding(outstanding);
            }
            if (assessment.getLoanCount() == null) {
                assessment.setLoanCount(loans.size());
            }
        }
    }

    private void applyRuleBasedAssessment(RiskAssessment assessment, List<Transaction> history) {
        int score = 15;
        List<String> reasons = new ArrayList<>();
        BigDecimal amount = assessment.getAmount() == null ? BigDecimal.ZERO : assessment.getAmount();

        if (amount.compareTo(new BigDecimal("500000")) > 0) {
            score += 45;
            reasons.add("Amount exceeds INR 500,000");
        } else if (amount.compareTo(new BigDecimal("100000")) > 0) {
            score += 20;
            reasons.add("Amount exceeds INR 100,000");
        }
        if ("INTERNATIONAL_WIRE".equals(assessment.getTransactionType())) {
            score += 30;
            reasons.add("International wire transaction");
        }
        if ("CRYPTO_EXCHANGE".equals(assessment.getTransactionType())) {
            score += 30;
            reasons.add("Crypto exchange transaction");
        }
        if (assessment.getPreviousTransactionCount() == 0) {
            score += 25;
            reasons.add("No previous transaction history");
        } else if (assessment.getPreviousTransactionCount() >= 5) {
            score += 10;
            reasons.add("High transaction frequency in customer history");
        }
        long failedTransactions = history.stream()
                .filter(transaction -> transaction.getStatus() != null
                        && (transaction.getStatus().equalsIgnoreCase("FAILED")
                        || transaction.getStatus().equalsIgnoreCase("DECLINED")))
                .count();
        if (failedTransactions > 0) {
            score += Math.min(20, (int) failedTransactions * 5);
            reasons.add(failedTransactions + " failed or declined transaction(s) in history");
        }
        long suspiciousTypes = history.stream()
                .filter(transaction -> transaction.getType() != null
                        && (transaction.getType().equalsIgnoreCase("INTERNATIONAL_WIRE")
                        || transaction.getType().equalsIgnoreCase("CRYPTO_EXCHANGE")
                        || transaction.getType().equalsIgnoreCase("CASH_WITHDRAWAL")))
                .count();
        if (suspiciousTypes > 0) {
            score += Math.min(20, (int) suspiciousTypes * 8);
            reasons.add("Suspicious transaction type found in history");
        }
        BigDecimal historicalAverage = history.stream()
                .map(Transaction::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (!history.isEmpty()) {
            historicalAverage = historicalAverage.divide(BigDecimal.valueOf(history.size()), 2, java.math.RoundingMode.HALF_UP);
            if (amount.compareTo(historicalAverage.multiply(new BigDecimal("3"))) > 0) {
                score += 20;
                reasons.add("Sudden high-value transaction compared with customer history");
            }
        }
        if (assessment.getFailedAttempts() > 0) {
            score += 10;
            reasons.add("Failed verification attempts");
        }
        if (Boolean.TRUE.equals(assessment.getNewDevice())) {
            score += 15;
            reasons.add("New device used for the transaction");
        }
        if (Boolean.TRUE.equals(assessment.getUnusualBehavior())) {
            score += 20;
            reasons.add("Unusual transaction behavior");
        }
        if (assessment.getAnnualIncome() != null
                && assessment.getAnnualIncome().compareTo(BigDecimal.ZERO) > 0
                && amount.compareTo(assessment.getAnnualIncome().multiply(new BigDecimal("0.25"))) > 0) {
            score += 15;
            reasons.add("Transaction amount exceeds 25% of reported annual income");
        }
        if (assessment.getLoanOutstanding() != null
                && assessment.getAnnualIncome() != null
                && assessment.getAnnualIncome().compareTo(BigDecimal.ZERO) > 0
                && assessment.getLoanOutstanding().compareTo(assessment.getAnnualIncome()) > 0) {
            score += 15;
            reasons.add("Total loan outstanding exceeds annual income");
        }
        String pattern = assessment.getTransactionPattern();
        if (pattern != null && ("IRREGULAR".equalsIgnoreCase(pattern) || "RAPID_SUCCESSIVE".equalsIgnoreCase(pattern))) {
            score += 12;
            reasons.add("Irregular / rapid transaction pattern reported");
        }

        score = Math.min(score, 100);
        if (reasons.isEmpty()) {
            reasons.add("No material risk factors detected");
        }

        assessment.setRiskScore(score);
        assessment.setRiskLevel(score >= 85 ? "CRITICAL" : score >= 65 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW");
        assessment.setDecision(score >= 85 ? "BLOCKED" : score >= 65 ? "FLAGGED"
                : score >= 40 ? "UNDER_REVIEW" : "APPROVED");
        assessment.setReasons(String.join("; ", reasons));
        assessment.setAiAnalysis("This assessment was calculated by the FinCore rule engine using the submitted "
                + "customer, account, loan, transaction and database history details.");
        assessment.setAiModel("N/A");
        assessment.setAnalysisSource("BACKEND_RULES");
    }
}