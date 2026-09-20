package com.example.risk_scoring_service.dto;

import java.time.LocalDateTime;

import com.example.risk_scoring_service.enums.RiskLevel;
import com.example.risk_scoring_service.enums.RiskStatus;

import lombok.Data;

@Data
public class RiskAssessmentHistoryDTO {

    private Long historyId;

    private Long riskAssessmentId;

    private Integer riskScore;

    public Long getHistoryId() {
		return historyId;
	}

	public void setHistoryId(Long historyId) {
		this.historyId = historyId;
	}

	public Long getRiskAssessmentId() {
		return riskAssessmentId;
	}

	public void setRiskAssessmentId(Long riskAssessmentId) {
		this.riskAssessmentId = riskAssessmentId;
	}

	public Integer getRiskScore() {
		return riskScore;
	}

	public void setRiskScore(Integer riskScore) {
		this.riskScore = riskScore;
	}

	public RiskLevel getRiskLevel() {
		return riskLevel;
	}

	public void setRiskLevel(RiskLevel riskLevel) {
		this.riskLevel = riskLevel;
	}

	public RiskStatus getRiskStatus() {
		return riskStatus;
	}

	public void setRiskStatus(RiskStatus riskStatus) {
		this.riskStatus = riskStatus;
	}

	public LocalDateTime getAssessmentDate() {
		return assessmentDate;
	}

	public void setAssessmentDate(LocalDateTime assessmentDate) {
		this.assessmentDate = assessmentDate;
	}

	private RiskLevel riskLevel;

    private RiskStatus riskStatus;

    private LocalDateTime assessmentDate;
}