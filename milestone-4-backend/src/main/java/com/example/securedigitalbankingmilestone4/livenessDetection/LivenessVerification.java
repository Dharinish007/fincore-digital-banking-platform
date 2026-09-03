package com.example.securedigitalbankingmilestone4.livenessDetection;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "liveness_verifications")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class LivenessVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long verificationId;

    private Long userId;

    private Long attempt;

    private String challenge;

    private boolean isLive;

    private double confidenceScore;

    private String status;

    private LocalDateTime verifiedAt;
}
