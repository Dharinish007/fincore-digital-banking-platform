package com.example.milestone3.risk;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "risk_assessment")
@Data
@NoArgsConstructor
public class RiskAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;
    private Long transactionId;
    private Integer riskScore;
    private String decision;
    private String reasons;
    private LocalDateTime assessedAt;
    private BigDecimal amount;
    private String transactionType;
    private String location;
    private String deviceType;
    private Boolean internationalTransaction;
    private Boolean newDevice;
    private int previousTransactionCount;
    private int failedAttempts;
    private Boolean unusualBehavior;
    private String riskLevel;
    private String assessmentStatus;

    // ---- Customer financial / account details entered via the dashboard ----
    private String customerName;
    private BigDecimal annualIncome;
    private BigDecimal accountBalance;
    private String accountType;
    private String accountNumber;
    private String employmentStatus;

    // ---- Loan details ----
    private BigDecimal loanOutstanding;
    private Integer loanCount;

    // ---- Transaction pattern & behavioural risk factors ----
    private String transactionPattern;
    private String depositFrequency;

    // ---- Rule-based analysis explanation ----
    @Column(columnDefinition = "TEXT")
    private String aiAnalysis;
    private String aiModel;
    private String analysisSource;

    // ---- Snapshot of the customer's retrieved transaction history ----
    @Column(columnDefinition = "TEXT")
    private String transactionHistory;

    public RiskAssessment(Long id, Long customerId, Long transactionId, Integer riskScore,
                          String decision, String reasons, LocalDateTime assessedAt) {
        this.id = id;
        this.customerId = customerId;
        this.transactionId = transactionId;
        this.riskScore = riskScore;
        this.decision = decision;
        this.reasons = reasons;
        this.assessedAt = assessedAt;
    }
}
