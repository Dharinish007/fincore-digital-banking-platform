package com.fincore.loanservice.service;

import com.fincore.loanservice.dto.CreditAssessmentRequest;
import com.fincore.loanservice.dto.CreditAssessmentResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CreditAssessmentService {

  public CreditAssessmentResult assess(CreditAssessmentRequest request) {
    int score = 0;

    if (request.getMonthlyIncome() != null) {
      BigDecimal income = request.getMonthlyIncome();
      if (income.compareTo(new BigDecimal("80000")) >= 0) score += 25;
      else if (income.compareTo(new BigDecimal("50000")) >= 0) score += 18;
      else if (income.compareTo(new BigDecimal("30000")) >= 0) score += 10;
      else score += 4;
    }

    if (request.getAge() != null) {
      if (request.getAge() >= 25 && request.getAge() <= 55) score += 15;
      else if (request.getAge() >= 21 && request.getAge() <= 60) score += 8;
      else score += 3;
    }

    if (request.getYearsEmployed() != null) {
      if (request.getYearsEmployed() >= 3) score += 15;
      else if (request.getYearsEmployed() >= 1) score += 8;
      else score += 2;
    }

    if (request.getCreditHistoryYears() != null) {
      if (request.getCreditHistoryYears() >= 5) score += 15;
      else if (request.getCreditHistoryYears() >= 2) score += 8;
      else score += 2;
    }

    if (request.getSavingsBalance() != null) {
      BigDecimal savings = request.getSavingsBalance();
      if (savings.compareTo(new BigDecimal("100000")) >= 0) score += 10;
      else if (savings.compareTo(new BigDecimal("40000")) >= 0) score += 6;
      else if (savings.compareTo(new BigDecimal("10000")) >= 0) score += 3;
    }

    if (request.getMonthlyObligations() != null && request.getMonthlyIncome() != null && request.getMonthlyIncome().compareTo(BigDecimal.ZERO) > 0) {
      BigDecimal debtRatio = request.getMonthlyObligations().divide(request.getMonthlyIncome(), 4, RoundingMode.HALF_UP);
      if (debtRatio.compareTo(new BigDecimal("0.25")) <= 0) score += 10;
      else if (debtRatio.compareTo(new BigDecimal("0.40")) <= 0) score += 6;
      else if (debtRatio.compareTo(new BigDecimal("0.60")) <= 0) score += 2;
      else score -= 15;
    }

    if (request.getExistingLoanCount() != null) {
      if (request.getExistingLoanCount() == 0) score += 7;
      else if (request.getExistingLoanCount() == 1) score += 4;
      else score -= (request.getExistingLoanCount() * 8);
    }

    if (request.getDefaultHistoryCount() != null) {
      if (request.getDefaultHistoryCount() == 0) score += 8;
      else if (request.getDefaultHistoryCount() == 1) score += 2;
      else score -= (request.getDefaultHistoryCount() * 12);
    }

    score = Math.max(0, Math.min(100, score));

    CreditAssessmentResult result = new CreditAssessmentResult();
    result.setCustomerId(request.getCustomerId());
    result.setScore(score);

    if (score >= 75) {
      result.setRiskLevel("LOW");
      result.setDecision("APPROVED");
      result.setRecommendedAmount(request.getLoanAmount());
      result.setSuggestedInterestRate(new BigDecimal("8.50"));
    } else if (score >= 55) {
      result.setRiskLevel("MEDIUM");
      result.setDecision("CONDITIONAL");
      result.setRecommendedAmount(request.getLoanAmount().multiply(new BigDecimal("0.75"))); 
      result.setSuggestedInterestRate(new BigDecimal("11.25"));
    } else {
      result.setRiskLevel("HIGH");
      result.setDecision("REJECTED");
      result.setRecommendedAmount(BigDecimal.ZERO);
      result.setSuggestedInterestRate(new BigDecimal("15.00"));
    }

    return result;
  }
}
