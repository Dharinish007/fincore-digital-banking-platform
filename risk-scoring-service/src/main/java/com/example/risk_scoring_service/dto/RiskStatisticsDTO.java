package com.example.risk_scoring_service.dto;

import lombok.Data;

@Data
public class RiskStatisticsDTO {

    private long totalRiskAssessments;

    private long lowRiskCount;

    private long mediumRiskCount;

    private long highRiskCount;

    public long getTotalRiskAssessments() {
		return totalRiskAssessments;
	}

	public void setTotalRiskAssessments(long totalRiskAssessments) {
		this.totalRiskAssessments = totalRiskAssessments;
	}

	public long getLowRiskCount() {
		return lowRiskCount;
	}

	public void setLowRiskCount(long lowRiskCount) {
		this.lowRiskCount = lowRiskCount;
	}

	public long getMediumRiskCount() {
		return mediumRiskCount;
	}

	public void setMediumRiskCount(long mediumRiskCount) {
		this.mediumRiskCount = mediumRiskCount;
	}

	public long getHighRiskCount() {
		return highRiskCount;
	}

	public void setHighRiskCount(long highRiskCount) {
		this.highRiskCount = highRiskCount;
	}

	public long getSafeCount() {
		return safeCount;
	}

	public void setSafeCount(long safeCount) {
		this.safeCount = safeCount;
	}

	public long getReviewCount() {
		return reviewCount;
	}

	public void setReviewCount(long reviewCount) {
		this.reviewCount = reviewCount;
	}

	public long getFlaggedCount() {
		return flaggedCount;
	}

	public void setFlaggedCount(long flaggedCount) {
		this.flaggedCount = flaggedCount;
	}

	public double getAverageRiskScore() {
		return averageRiskScore;
	}

	public void setAverageRiskScore(double averageRiskScore) {
		this.averageRiskScore = averageRiskScore;
	}

	private long safeCount;

    private long reviewCount;

    private long flaggedCount;

    private double averageRiskScore;
}
