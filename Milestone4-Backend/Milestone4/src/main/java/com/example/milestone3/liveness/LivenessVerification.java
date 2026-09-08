package com.example.milestone3.liveness;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "liveness_verification")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LivenessVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;
    private String sessionId;
    private String status;
    @Column(name = "confidence_score", precision = 5, scale = 2)
    private BigDecimal confidenceScore;
    private String verificationMethod;
    private String ipAddress;
    private String failureReason;
    private LocalDateTime verifiedAt;
    private LocalDateTime createdAt;
}
