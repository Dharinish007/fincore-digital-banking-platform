package com.fincore.BankingManagement.CreditCheck.entity;

import com.fincore.BankingManagement.CreditCheck.enums.CreditStatus;
import com.fincore.BankingManagement.CreditCheck.enums.PreviousLoanStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit_check")
public class CreditCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "credit_check_id")
    private Integer creditCheckId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id", nullable = false)
    private LoanApplication loanApplication;

    @Column(name = "credit_score")
    private Integer creditScore;

    @Column(name = "monthly_income")
    private BigDecimal monthlyIncome;

    @Column(name = "existing_loan_count")
    private Integer existingLoanCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_loan_status")
    private PreviousLoanStatus previousLoanStatus = PreviousLoanStatus.NO;

    @Column(name = "credit_status")
    @Enumerated(EnumType.STRING)
    private CreditStatus creditStatus = CreditStatus.REVIEW;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "checked_at")
    private LocalDateTime checkedAt;

    public CreditCheck() {
    }

    public CreditCheck(Integer creditCheckId, LoanApplication loanApplication, Integer creditScore,
            BigDecimal monthlyIncome, Integer existingLoanCount, PreviousLoanStatus previousLoanStatus,
            CreditStatus creditStatus, String remarks, LocalDateTime checkedAt) {
        this.creditCheckId = creditCheckId;
        this.loanApplication = loanApplication;
        this.creditScore = creditScore;
        this.monthlyIncome = monthlyIncome;
        this.existingLoanCount = existingLoanCount;
        this.previousLoanStatus = previousLoanStatus;
        this.creditStatus = creditStatus;
        this.remarks = remarks;
        this.checkedAt = checkedAt;
    }

    public Integer getCreditCheckId() {
        return creditCheckId;
    }

    public void setCreditCheckId(Integer creditCheckId) {
        this.creditCheckId = creditCheckId;
    }

    public LoanApplication getLoanApplication() {
        return loanApplication;
    }

    public void setLoanApplication(LoanApplication loanApplication) {
        this.loanApplication = loanApplication;
    }

    public Integer getCreditScore() {
        return creditScore;
    }

    public void setCreditScore(Integer creditScore) {
        this.creditScore = creditScore;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public Integer getExistingLoanCount() {
        return existingLoanCount;
    }

    public void setExistingLoanCount(Integer existingLoanCount) {
        this.existingLoanCount = existingLoanCount;
    }

    public PreviousLoanStatus getPreviousLoanStatus() {
        return previousLoanStatus;
    }

    public void setPreviousLoanStatus(PreviousLoanStatus previousLoanStatus) {
        this.previousLoanStatus = previousLoanStatus;
    }

    public CreditStatus getCreditStatus() {
        return creditStatus;
    }

    public void setCreditStatus(CreditStatus creditStatus) {
        this.creditStatus = creditStatus;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCheckedAt() {
        return checkedAt;
    }

    public void setCheckedAt(LocalDateTime checkedAt) {
        this.checkedAt = checkedAt;
    }
}