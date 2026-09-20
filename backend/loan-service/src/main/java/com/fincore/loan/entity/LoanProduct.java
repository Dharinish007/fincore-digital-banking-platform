package com.fincore.loan.entity;

import com.fincore.loan.enums.LoanProductStatus;
import com.fincore.loan.enums.LoanType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_products", uniqueConstraints = {
        @UniqueConstraint(columnNames = "product_code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_code", nullable = false, length = 50)
    private String productCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "loan_type", nullable = false, length = 30)
    private LoanType loanType;

    @Column(name = "min_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal minAmount;

    @Column(name = "max_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal maxAmount;

    @Column(name = "interest_rate", nullable = false, precision = 6, scale = 2)
    private BigDecimal interestRate;

    @Column(name = "min_tenure_months", nullable = false)
    private Integer minTenureMonths;

    @Column(name = "max_tenure_months", nullable = false)
    private Integer maxTenureMonths;

    @Column(name = "processing_fee_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal processingFeePercentage = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private LoanProductStatus status = LoanProductStatus.ACTIVE;

    @Column(length = 500)
    private String description;

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
