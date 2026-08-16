package com.fincore.BankingManagement.CreditCheck.dto;

import java.math.BigDecimal;

public class CreditCheckRequest {
    private Integer customerId;
    private String customerName;
    private Integer loanId;
    private String loanType;
    private BigDecimal loanAmount;
    private BigDecimal monthlyIncome;
    private Integer creditScore;
    private Integer existingLoanCount;
    private String creditStatus;
    private String remarks;

    public CreditCheckRequest() {
    }

    public CreditCheckRequest(Integer customerId, String customerName, Integer loanId, String loanType,
            BigDecimal loanAmount, BigDecimal monthlyIncome, Integer creditScore,
            Integer existingLoanCount, String creditStatus, String remarks) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.loanId = loanId;
        this.loanType = loanType;
        this.loanAmount = loanAmount;
        this.monthlyIncome = monthlyIncome;
        this.creditScore = creditScore;
        this.existingLoanCount = existingLoanCount;
        this.creditStatus = creditStatus;
        this.remarks = remarks;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Integer getLoanId() {
        return loanId;
    }

    public void setLoanId(Integer loanId) {
        this.loanId = loanId;
    }

    public String getLoanType() {
        return loanType;
    }

    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(BigDecimal loanAmount) {
        this.loanAmount = loanAmount;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public Integer getCreditScore() {
        return creditScore;
    }

    public void setCreditScore(Integer creditScore) {
        this.creditScore = creditScore;
    }

    public Integer getExistingLoanCount() {
        return existingLoanCount;
    }

    public void setExistingLoanCount(Integer existingLoanCount) {
        this.existingLoanCount = existingLoanCount;
    }

    public String getCreditStatus() {
        return creditStatus;
    }

    public void setCreditStatus(String creditStatus) {
        this.creditStatus = creditStatus;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
