package com.fincore.loanservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class LoanRequest {

  @NotNull(message = "Customer ID is required")
  @Positive(message = "Customer ID must be positive")
  private Long customerId;

  @NotNull(message = "Loan amount is required")
  @DecimalMin(value = "1000.00", message = "Loan amount must be at least 1000")
  private BigDecimal loanAmount;

  @NotNull(message = "Interest rate is required")
  @DecimalMin(value = "0.0", message = "Interest rate cannot be negative")
  private BigDecimal interestRate;

  @NotNull(message = "Tenure is required")
  @Positive(message = "Tenure must be positive")
  private Integer tenureMonths;

  public LoanRequest() {
  }

  public Long getCustomerId() {
    return customerId;
  }

  public void setCustomerId(Long customerId) {
    this.customerId = customerId;
  }

  public BigDecimal getLoanAmount() {
    return loanAmount;
  }

  public void setLoanAmount(BigDecimal loanAmount) {
    this.loanAmount = loanAmount;
  }

  public BigDecimal getInterestRate() {
    return interestRate;
  }

  public void setInterestRate(BigDecimal interestRate) {
    this.interestRate = interestRate;
  }

  public Integer getTenureMonths() {
    return tenureMonths;
  }

  public void setTenureMonths(Integer tenureMonths) {
    this.tenureMonths = tenureMonths;
  }
}
