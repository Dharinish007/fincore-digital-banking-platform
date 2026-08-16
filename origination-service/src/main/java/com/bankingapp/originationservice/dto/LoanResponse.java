package com.bankingapp.originationservice.dto;

import java.math.BigDecimal;

public class LoanResponse {

    private Long loanAccountId;
    private String loanNumber;
    private Long customerId;
    private BigDecimal loanAmount;
    private BigDecimal interestRate;
    private Integer tenureMonths;
    private BigDecimal disbursedAmount;
    private BigDecimal outstandingAmount;
    private String status;

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}