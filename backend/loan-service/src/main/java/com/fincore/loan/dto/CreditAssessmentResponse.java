package com.fincore.loan.dto;

import com.fincore.loan.entity.CreditAssessment;
import com.fincore.loan.enums.AssessmentDecision;
import com.fincore.loan.enums.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreditAssessmentResponse {

    private Long id;
    private Long applicationId;
    private Integer creditScore;
    private RiskLevel riskLevel;
    private AssessmentDecision decision;
    private BigDecimal assessedMonthlyIncome;
    private BigDecimal assessedMonthlyExpenses;
    private BigDecimal existingMonthlyDebt;
    private BigDecimal debtToIncomeRatio;
    private BigDecimal proposedEmi;
    private BigDecimal maxEligibleAmount;
    private String scoreBreakdown;
    private String assessmentSummary;
    private LocalDateTime assessedAt;

    public static CreditAssessmentResponse from(CreditAssessment ca) {
        if (ca == null) return null;
        return CreditAssessmentResponse.builder()
                .id(ca.getId())
                .applicationId(ca.getApplicationId())
                .creditScore(ca.getCreditScore())
                .riskLevel(ca.getRiskLevel())
                .decision(ca.getDecision())
                .assessedMonthlyIncome(ca.getAssessedMonthlyIncome())
                .assessedMonthlyExpenses(ca.getAssessedMonthlyExpenses())
                .existingMonthlyDebt(ca.getExistingMonthlyDebt())
                .debtToIncomeRatio(ca.getDebtToIncomeRatio())
                .proposedEmi(ca.getProposedEmi())
                .maxEligibleAmount(ca.getMaxEligibleAmount())
                .scoreBreakdown(ca.getScoreBreakdown())
                .assessmentSummary(ca.getAssessmentSummary())
                .assessedAt(ca.getAssessedAt())
                .build();
    }
}
