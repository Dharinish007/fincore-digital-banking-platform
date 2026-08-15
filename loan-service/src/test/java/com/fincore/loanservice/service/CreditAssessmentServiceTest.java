package com.fincore.loanservice.service;

import com.fincore.loanservice.dto.CreditAssessmentRequest;
import com.fincore.loanservice.dto.CreditAssessmentResult;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class CreditAssessmentServiceTest {

  private final CreditAssessmentService creditAssessmentService = new CreditAssessmentService();

  @Test
  void shouldApproveStableBorrower() {
    CreditAssessmentRequest request = new CreditAssessmentRequest();
    request.setCustomerId(1001L);
    request.setMonthlyIncome(new BigDecimal("120000"));
    request.setMonthlyObligations(new BigDecimal("15000"));
    request.setLoanAmount(new BigDecimal("350000"));
    request.setAge(34);
    request.setYearsEmployed(4);
    request.setCreditHistoryYears(7);
    request.setSavingsBalance(new BigDecimal("220000"));
    request.setExistingLoanCount(1);
    request.setDefaultHistoryCount(0);

    CreditAssessmentResult result = creditAssessmentService.assess(request);

    assertNotNull(result);
    assertTrue(result.getScore() >= 70, "Score should be acceptable for a stable borrower");
    assertEquals("LOW", result.getRiskLevel());
    assertEquals("APPROVED", result.getDecision());
  }

  @Test
  void shouldRejectHighDebtBorrower() {
    CreditAssessmentRequest request = new CreditAssessmentRequest();
    request.setCustomerId(2002L);
    request.setMonthlyIncome(new BigDecimal("60000"));
    request.setMonthlyObligations(new BigDecimal("50000"));
    request.setLoanAmount(new BigDecimal("900000"));
    request.setAge(29);
    request.setYearsEmployed(1);
    request.setCreditHistoryYears(1);
    request.setSavingsBalance(new BigDecimal("20000"));
    request.setExistingLoanCount(3);
    request.setDefaultHistoryCount(2);

    CreditAssessmentResult result = creditAssessmentService.assess(request);

    assertNotNull(result);
    assertTrue(result.getScore() < 55, "Score should be poor for a high-debt borrower");
    assertEquals("REJECTED", result.getDecision());
  }
}
