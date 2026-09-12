package com.fincore.face_match_service.entity;

// package com.fincore.facematch.entity;

import com.fincore.face_match_service.enums.FaceMatchStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "face_match_results")
public class FaceMatch {
    @Column(name = "document_id", nullable = false)
private Long documentId;

public Long getDocumentId() {
    return documentId;
}

public void setDocumentId(Long documentId) {
    this.documentId = documentId;
}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "verification_id", unique = true, nullable = false)
    private String verificationId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "match_score")
    private Double matchScore;

    @Column(name = "threshold")
    private Double threshold;

    @Column(name = "matched")
    private Boolean matched;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FaceMatchStatus status;

    @Column(name = "message")
    private String message;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVerificationId() {
        return verificationId;
    }

    public void setVerificationId(String verificationId) {
        this.verificationId = verificationId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Double matchScore) {
        this.matchScore = matchScore;
    }

    public Double getThreshold() {
        return threshold;
    }

    public void setThreshold(Double threshold) {
        this.threshold = threshold;
    }

    public Boolean getMatched() {
        return matched;
    }

    public void setMatched(Boolean matched) {
        this.matched = matched;
    }

    public FaceMatchStatus getStatus() {
        return status;
    }

    public void setStatus(FaceMatchStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}