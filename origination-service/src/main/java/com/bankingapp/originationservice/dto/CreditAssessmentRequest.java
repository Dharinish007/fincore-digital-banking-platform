package com.bankingapp.originationservice.dto;

import java.math.BigDecimal;

public class CreditAssessmentRequest {

    private Long customerId;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyObligations;
    private BigDecimal loanAmount;
    private Integer age;
    private Integer yearsEmployed;
    private Integer creditHistoryYears;
    private BigDecimal savingsBalance;
    private Integer existingLoanCount;
    private Integer defaultHistoryCount;

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public BigDecimal getMonthlyObligations() {
        return monthlyObligations;
    }

    public void setMonthlyObligations(
            BigDecimal monthlyObligations) {
        this.monthlyObligations = monthlyObligations;
    }

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(BigDecimal loanAmount) {
        this.loanAmount = loanAmount;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Integer getYearsEmployed() {
        return yearsEmployed;
    }

    public void setYearsEmployed(Integer yearsEmployed) {
        this.yearsEmployed = yearsEmployed;
    }

    public Integer getCreditHistoryYears() {
        return creditHistoryYears;
    }

    public void setCreditHistoryYears(
            Integer creditHistoryYears) {
        this.creditHistoryYears = creditHistoryYears;
    }

    public BigDecimal getSavingsBalance() {
        return savingsBalance;
    }

    public void setSavingsBalance(
            BigDecimal savingsBalance) {
        this.savingsBalance = savingsBalance;
    }

    public Integer getExistingLoanCount() {
        return existingLoanCount;
    }

    public void setExistingLoanCount(
            Integer existingLoanCount) {
        this.existingLoanCount = existingLoanCount;
    }

    public Integer getDefaultHistoryCount() {
        return defaultHistoryCount;
    }

    public void setDefaultHistoryCount(
            Integer defaultHistoryCount) {
        this.defaultHistoryCount = defaultHistoryCount;
    }
}