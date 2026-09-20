package com.fincore.loan.entity;

import com.fincore.loan.enums.AssessmentDecision;
import com.fincore.loan.enums.RiskLevel;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit_assessments", uniqueConstraints = {
        @UniqueConstraint(columnNames = "application_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreditAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", nullable = false)
    private Long applicationId;

    @Column(name = "credit_score", nullable = false)
    private Integer creditScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false, length = 20)
    private RiskLevel riskLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AssessmentDecision decision;

    @Column(name = "assessed_monthly_income", precision = 19, scale = 2)
    private BigDecimal assessedMonthlyIncome;

    @Column(name = "assessed_monthly_expenses", precision = 19, scale = 2)
    private BigDecimal assessedMonthlyExpenses;

    @Column(name = "existing_monthly_debt", precision = 19, scale = 2)
    private BigDecimal existingMonthlyDebt;

    @Column(name = "debt_to_income_ratio", precision = 6, scale = 2)
    private BigDecimal debtToIncomeRatio;

    @Column(name = "proposed_emi", precision = 19, scale = 2)
    private BigDecimal proposedEmi;

    @Column(name = "max_eligible_amount", precision = 19, scale = 2)
    private BigDecimal maxEligibleAmount;

    @Column(name = "score_breakdown", length = 2000)
    private String scoreBreakdown;

    @Column(name = "assessment_summary", length = 1000)
    private String assessmentSummary;

    @Column(name = "assessed_at", nullable = false)
    private LocalDateTime assessedAt;

    @PrePersist
    protected void onCreate() {
        if (assessedAt == null) {
            assessedAt = LocalDateTime.now();
        }
    }
}
