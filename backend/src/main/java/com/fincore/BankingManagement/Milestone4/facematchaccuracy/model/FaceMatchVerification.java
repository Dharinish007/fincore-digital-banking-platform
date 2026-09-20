package com.fincore.BankingManagement.Milestone4.facematchaccuracy.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "face_match_verification")
public class FaceMatchVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "verification_id")
    private Long verificationId;

    @Column(name = "matched", nullable = false)
    private boolean matched;

    @Column(name = "distance")
    private Double distance;

    @Column(name = "threshold")
    private Double threshold;

    @Column(name = "model")
    private String model;

    @Column(name = "message")
    private String message;

    @Column(name = "verified_at", nullable = false)
    private LocalDateTime verifiedAt;


    @PrePersist
    public void prePersist() {
        verifiedAt = LocalDateTime.now();
    }


    public Long getVerificationId() {
        return verificationId;
    }

    public void setVerificationId(Long verificationId) {
        this.verificationId = verificationId;
    }


    public boolean isMatched() {
        return matched;
    }

    public void setMatched(boolean matched) {
        this.matched = matched;
    }


    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }


    public Double getThreshold() {
        return threshold;
    }

    public void setThreshold(Double threshold) {
        this.threshold = threshold;
    }


    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}