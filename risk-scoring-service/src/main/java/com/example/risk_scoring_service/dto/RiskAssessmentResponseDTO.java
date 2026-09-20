package com.example.risk_scoring_service.dto;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.risk_scoring_service.enums.RiskLevel;
import com.example.risk_scoring_service.enums.RiskStatus;

import lombok.Data;

@Data
public class RiskAssessmentResponseDTO {
	private Long riskId;

    private Long customerId;

    private String customerName;

    private String accountNumber;

    public Long getRiskId() {
		return riskId;
	}

	public void setRiskId(Long riskId) {
		this.riskId = riskId;
	}

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
	    this.customerId = customerId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getAccountNumber() {
		return accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	public BigDecimal getTransactionAmount() {
		return transactionAmount;
	}

	public void setTransactionAmount(BigDecimal transactionAmount) {
		this.transactionAmount = transactionAmount;
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

	public LocalDateTime getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(LocalDateTime updatedDate) {
		this.updatedDate = updatedDate;
	}

	public List<RiskFactorDTO> getRiskFactors() {
		return riskFactors;
	}

	public void setRiskFactors(List<RiskFactorDTO> riskFactors) {
		this.riskFactors = riskFactors;
	}

	private String transactionId;

    private BigDecimal transactionAmount;

    private Integer riskScore;

    private RiskLevel riskLevel;

    private RiskStatus riskStatus;

    private LocalDateTime assessmentDate;

    private LocalDateTime updatedDate;

    private List<RiskFactorDTO> riskFactors;
}
