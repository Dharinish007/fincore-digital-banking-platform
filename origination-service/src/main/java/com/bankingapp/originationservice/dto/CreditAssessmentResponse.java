package com.bankingapp.originationservice.dto;

import java.math.BigDecimal;

public class CreditAssessmentResponse {

    private Long customerId;
    private Integer score;
    private String riskLevel;
    private String decision;
    private BigDecimal recommendedAmount;
    private BigDecimal suggestedInterestRate;

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public BigDecimal getRecommendedAmount() {
        return recommendedAmount;
    }

    public void setRecommendedAmount(BigDecimal recommendedAmount) {
        this.recommendedAmount = recommendedAmount;
    }

    public BigDecimal getSuggestedInterestRate() {
        return suggestedInterestRate;
    }

    public void setSuggestedInterestRate(BigDecimal suggestedInterestRate) {
        this.suggestedInterestRate = suggestedInterestRate;
    }
}