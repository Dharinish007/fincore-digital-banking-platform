package com.fincore.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "npa_classifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NpaRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "loan_id", nullable = false, length = 36)
    private String loanId;

    @Column(name = "loan_number", nullable = false, length = 50)
    private String loanNumber;

    @Column(name = "customer_name", nullable = false, length = 150)
    private String customerName;

    @Column(name = "dpd_days", nullable = false)
    @Builder.Default
    private Integer dpdDays = 0;

    @Column(name = "classification_category", nullable = false, length = 50)
    @Builder.Default
    private String classificationCategory = "STANDARD";

    @Column(name = "outstanding_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal outstandingAmount;

    @Column(name = "overdue_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal overdueAmount = BigDecimal.ZERO;

    @Column(name = "provision_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal provisionPercentage = new BigDecimal("0.40");

    @Column(name = "provision_amount", precision = 15, scale = 2)
    private BigDecimal provisionAmount;

    @Column(name = "last_evaluated_at")
    @Builder.Default
    private LocalDateTime lastEvaluatedAt = LocalDateTime.now();
}
