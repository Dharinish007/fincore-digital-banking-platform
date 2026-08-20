package com.fincore.loan.entity;

import com.fincore.loan.enums.LoanStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans", uniqueConstraints = {
        @UniqueConstraint(columnNames = "loan_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "loan_number", nullable = false, updatable = false, length = 30)
    private String loanNumber;

    @Column(name = "application_id", nullable = false)
    private Long applicationId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "account_id")
    private Long accountId;

    @Column(name = "account_number", nullable = false, length = 30)
    private String accountNumber;

    @Column(name = "loan_product_id", nullable = false)
    private Long loanProductId;

    @Column(name = "loan_product_name", nullable = false, length = 100)
    private String loanProductName;

    @Column(name = "principal_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal principalAmount;

    @Column(name = "interest_rate", nullable = false, precision = 6, scale = 2)
    private BigDecimal interestRate;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Column(name = "emi_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal emiAmount;

    @Column(name = "total_repayment_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal totalRepaymentAmount;

    @Column(name = "total_interest", nullable = false, precision = 19, scale = 2)
    private BigDecimal totalInterest;

    @Column(name = "outstanding_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal outstandingAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private LoanStatus status = LoanStatus.PENDING_DISBURSEMENT;

    @Column(name = "disbursed_at")
    private LocalDateTime disbursedAt;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
