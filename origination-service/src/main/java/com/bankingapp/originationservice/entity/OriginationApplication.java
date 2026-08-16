package com.bankingapp.originationservice.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "origination_applications")
public class OriginationApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;

    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal loanAmount;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(nullable = false)
    private Integer tenureMonths;

    private BigDecimal monthlyIncome;

    private BigDecimal monthlyObligations;

    private Integer age;

    private Integer yearsEmployed;

    private Integer creditHistoryYears;

    private BigDecimal savingsBalance;

    private Integer existingLoanCount;

    private Integer defaultHistoryCount;

    private Long loanAccountId;

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
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

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public BigDecimal getMonthlyObligations() {
        return monthlyObligations;
    }

    public void setMonthlyObligations(BigDecimal monthlyObligations) {
        this.monthlyObligations = monthlyObligations;
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

    public void setCreditHistoryYears(Integer creditHistoryYears) {
        this.creditHistoryYears = creditHistoryYears;
    }

    public BigDecimal getSavingsBalance() {
        return savingsBalance;
    }

    public void setSavingsBalance(BigDecimal savingsBalance) {
        this.savingsBalance = savingsBalance;
    }

    public Integer getExistingLoanCount() {
        return existingLoanCount;
    }

    public void setExistingLoanCount(Integer existingLoanCount) {
        this.existingLoanCount = existingLoanCount;
    }

    public Integer getDefaultHistoryCount() {
        return defaultHistoryCount;
    }

    public void setDefaultHistoryCount(Integer defaultHistoryCount) {
        this.defaultHistoryCount = defaultHistoryCount;
    }

    public Long getLoanAccountId() {
        return loanAccountId;
    }

    public void setLoanAccountId(Long loanAccountId) {
        this.loanAccountId = loanAccountId;
    }
}