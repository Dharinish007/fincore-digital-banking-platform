package com.fincore.BankingManagement.Milestone2.CreditCheck.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_application")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanOrigination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loan_id")
    private Long loanId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "customer_name")
    private String customerName;

    // =====================================================
    // Personal Information
    // =====================================================
    @Column(name = "full_name")
    private String fullName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "mobile", length = 20)
    private String mobile;

    @Column(name = "email", length = 100)
    private String email;

    // =====================================================
    // Address Information
    // =====================================================
    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "pincode", length = 20)
    private String pincode;

    // =====================================================
    // Employment Information
    // =====================================================
    @Column(name = "employment_type", length = 50)
    private String employmentType;

    @Column(name = "employer_name", length = 255)
    private String employerName;

    @Column(name = "job_title", length = 100)
    private String jobTitle;

    @Column(name = "work_experience", length = 100)
    private String workExperience;

    // =====================================================
    // Income Information
    // =====================================================
    @Column(name = "monthly_income", precision = 15, scale = 2)
    private BigDecimal monthlyIncome;

    @Column(name = "other_income", precision = 15, scale = 2)
    private BigDecimal otherIncome;

    // =====================================================
    // Loan Information
    // =====================================================
    @Enumerated(EnumType.STRING)
    @Column(name = "loan_type", nullable = false)
    private LoanType loanType;

    @Column(name = "loan_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal loanAmount;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Column(name = "interest_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(name = "purpose", length = 500)
    private String purpose;

    // =====================================================
    // Application Status
    // =====================================================
    @Enumerated(EnumType.STRING)
    @Column(name = "application_status", nullable = false)
    private ApplicationStatus applicationStatus;

    @Column(name = "application_date")
    private LocalDate applicationDate;

    // =====================================================
    // Audit Timestamps
    // =====================================================
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // =====================================================
    // JPA Lifecycle Callbacks
    // =====================================================
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (applicationDate == null) {
            applicationDate = LocalDate.now();
        }

        if (applicationStatus == null) {
            applicationStatus = ApplicationStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void setLoanType(LoanType loanType) {
        this.loanType = loanType;
    }
}