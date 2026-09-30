package com.fincore.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "loan_number", nullable = false, unique = true, length = 50)
    private String loanNumber;

    @Column(name = "customer_id", nullable = false, length = 36)
    private String customerId;

    @Column(name = "customer_name", nullable = false, length = 150)
    private String customerName;

    @Column(name = "account_id", nullable = false, length = 36)
    private String accountId;

    @Enumerated(EnumType.STRING)
    @Column(name = "loan_type", nullable = false, length = 50)
    private LoanType loanType;

    @Column(name = "principal_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal principalAmount;

    @Column(name = "interest_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Column(name = "emi_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal emiAmount;

    @Column(name = "total_payable", precision = 15, scale = 2)
    private BigDecimal totalPayable;

    @Column(name = "outstanding_principal", precision = 15, scale = 2)
    private BigDecimal outstandingPrincipal;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    @Builder.Default
    private LoanStatus status = LoanStatus.APPLIED;

    @Column(name = "applied_at", updatable = false)
    @Builder.Default
    private LocalDateTime appliedAt = LocalDateTime.now();

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "disbursed_at")
    private LocalDateTime disbursedAt;

    @Column(name = "npa_status", length = 30)
    @Builder.Default
    private String npaStatus = "STANDARD";

    @Column(name = "dpd_days")
    @Builder.Default
    private Integer dpdDays = 0;

    public enum LoanType {
        HOME_LOAN, PERSONAL_LOAN, BUSINESS_LOAN, AUTO_LOAN, EDUCATION_LOAN
    }

    public enum LoanStatus {
        APPLIED, UNDER_REVIEW, APPROVED, DISBURSED, ACTIVE, CLOSED, REJECTED, DEFAULTED
    }
}
