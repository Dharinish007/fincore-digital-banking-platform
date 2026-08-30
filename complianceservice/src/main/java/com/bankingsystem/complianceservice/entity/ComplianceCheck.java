package com.bankingsystem.complianceservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "compliance_checks")
@Getter
@Setter
@NoArgsConstructor
public class ComplianceCheck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long kycId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ComplianceVerdict verdict;

    @Column(nullable = false, length = 1000)
    private String reasons;

    @Column(length = 100)
    private String performedBy;

    @Column(nullable = false)
    private LocalDateTime checkedAt;

    @PrePersist
    void onCreate() {
        checkedAt = LocalDateTime.now();
    }
}
