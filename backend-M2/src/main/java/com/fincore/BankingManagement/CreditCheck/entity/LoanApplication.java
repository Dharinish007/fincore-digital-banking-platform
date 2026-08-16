package com.fincore.BankingManagement.CreditCheck.entity;

import com.fincore.BankingManagement.CreditCheck.enums.ApplicationStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "loan_application")
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loan_id")
    private Integer loanId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "loan_type", nullable = false)
    private String loanType;

    @Column(name = "loan_amount", nullable = false)
    private BigDecimal loanAmount;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Column(name = "interest_rate", nullable = false)
    private BigDecimal interestRate;

    @Column(name = "purpose")
    private String purpose;

    @Column(name = "application_status")
    @Enumerated(EnumType.STRING)
    private ApplicationStatus applicationStatus = ApplicationStatus.PENDING;

    @Column(name = "application_date")
    private LocalDateTime applicationDate;

    @OneToMany(mappedBy = "loanApplication")
    private List<CreditCheck> creditChecks;

    @OneToMany(mappedBy = "loanApplication")
    private List<EmiCalculation> emiCalculations;

    @OneToMany(mappedBy = "loanApplication")
    private List<LoanHistory> loanHistories;

    public LoanApplication() {
    }

    public LoanApplication(Integer loanId, Customer customer, String loanType, BigDecimal loanAmount,
            Integer tenureMonths, BigDecimal interestRate, String purpose,
            ApplicationStatus applicationStatus, LocalDateTime applicationDate,
            List<CreditCheck> creditChecks, List<EmiCalculation> emiCalculations,
            List<LoanHistory> loanHistories) {
        this.loanId = loanId;
        this.customer = customer;
        this.loanType = loanType;
        this.loanAmount = loanAmount;
        this.tenureMonths = tenureMonths;
        this.interestRate = interestRate;
        this.purpose = purpose;
        this.applicationStatus = applicationStatus;
        this.applicationDate = applicationDate;
        this.creditChecks = creditChecks;
        this.emiCalculations = emiCalculations;
        this.loanHistories = loanHistories;
    }

    public Integer getLoanId() {
        return loanId;
    }

    public void setLoanId(Integer loanId) {
        this.loanId = loanId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
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

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public ApplicationStatus getApplicationStatus() {
        return applicationStatus;
    }

    public void setApplicationStatus(ApplicationStatus applicationStatus) {
        this.applicationStatus = applicationStatus;
    }

    public LocalDateTime getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDateTime applicationDate) {
        this.applicationDate = applicationDate;
    }

    public List<CreditCheck> getCreditChecks() {
        return creditChecks;
    }

    public void setCreditChecks(List<CreditCheck> creditChecks) {
        this.creditChecks = creditChecks;
    }

    public List<EmiCalculation> getEmiCalculations() {
        return emiCalculations;
    }

    public void setEmiCalculations(List<EmiCalculation> emiCalculations) {
        this.emiCalculations = emiCalculations;
    }

    public List<LoanHistory> getLoanHistories() {
        return loanHistories;
    }

    public void setLoanHistories(List<LoanHistory> loanHistories) {
        this.loanHistories = loanHistories;
    }
}