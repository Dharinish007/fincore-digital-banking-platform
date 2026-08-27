package com.fincore.BankingManagement.CreditCheck.dto;

import java.math.BigDecimal;
import java.util.List;

public class CustomerLookupResponse {
    private Long customerId;
    private String customerName;
    private BigDecimal monthlyIncome;
    private Integer loanId;
    private String loanType;
    private BigDecimal loanAmount;
    private List<PreviousLoanResponse> previousLoans;

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
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

    public List<PreviousLoanResponse> getPreviousLoans() {
        return previousLoans;
    }

    public void setPreviousLoans(List<PreviousLoanResponse> previousLoans) {
        this.previousLoans = previousLoans;
    }
}
