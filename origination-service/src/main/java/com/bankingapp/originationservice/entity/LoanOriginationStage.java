package com.bankingapp.originationservice.entity;

import com.bankingapp.originationservice.enums.StageName;
import com.bankingapp.originationservice.enums.StageStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "loan_origination_stages")
public class LoanOriginationStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stageId;

    @Column
    private Long loanId;

    @Column(nullable = false)
    private Long applicationId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StageName stageName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StageStatus stageStatus = StageStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @Column(length = 255)
    private String remarks;

    @Column(length = 100)
    private String handledBy;

    @PrePersist
    protected void onCreate() {
        if (startedAt == null) {
            startedAt = LocalDateTime.now();
        }
    }

    // Generate getters and setters

    public Long getStageId() {
        return stageId;
    }

    public void setStageId(Long stageId) {
        this.stageId = stageId;
    }

    public Long getLoanId() {
        return loanId;
    }

    public void setLoanId(Long loanId) {
        this.loanId = loanId;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public StageName getStageName() {
        return stageName;
    }

    public void setStageName(StageName stageName) {
        this.stageName = stageName;
    }

    public StageStatus getStageStatus() {
        return stageStatus;
    }

    public void setStageStatus(StageStatus stageStatus) {
        this.stageStatus = stageStatus;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getHandledBy() {
        return handledBy;
    }

    public void setHandledBy(String handledBy) {
        this.handledBy = handledBy;
    }
}