package com.fincore.loanservice.entity;

import com.fincore.loanservice.enums.LoanStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "loan_account")
public class LoanAccount {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long loanAccountId;

  @Column(unique = true, nullable = false)
  private String loanNumber;

  @Column(nullable = false)
  private Long customerId;

  @Column(nullable = false, precision = 15, scale = 2)
  private BigDecimal loanAmount;

  @Column(precision = 5, scale = 2)
  private BigDecimal interestRate;

  private Integer tenureMonths;

  @Column(precision = 15, scale = 2)
  private BigDecimal disbursedAmount;

  @Column(precision = 15, scale = 2)
  private BigDecimal outstandingAmount;

  @Enumerated(EnumType.STRING)
  private LoanStatus status;

  // Default constructor
  public LoanAccount() {
  }

  // Getters and Setters

  public Long getLoanAccountId() {
    return loanAccountId;
  }

  public void setLoanAccountId(Long loanAccountId) {
    this.loanAccountId = loanAccountId;
  }

  public String getLoanNumber() {
    return loanNumber;
  }

  public void setLoanNumber(String loanNumber) {
    this.loanNumber = loanNumber;
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

  public BigDecimal getDisbursedAmount() {
    return disbursedAmount;
  }

  public void setDisbursedAmount(BigDecimal disbursedAmount) {
    this.disbursedAmount = disbursedAmount;
  }

  public BigDecimal getOutstandingAmount() {
    return outstandingAmount;
  }

  public void setOutstandingAmount(BigDecimal outstandingAmount) {
    this.outstandingAmount = outstandingAmount;
  }

  public LoanStatus getStatus() {
    return status;
  }

  public void setStatus(LoanStatus status) {
    this.status = status;
  }
}
