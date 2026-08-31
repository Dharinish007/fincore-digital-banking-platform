package com.example.risk_scoring_service.entity;
import jakarta.persistence.Entity;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.risk_scoring_service.enums.RiskLevel;
import com.example.risk_scoring_service.enums.RiskStatus;

import jakarta.persistence.*;

@Entity
@Table (name="risk_assessment")
@Data
public class RiskAssessment {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	private String customerId;
	private String customerName;
	private String accountNumber;
	private String transactionId;
	private BigDecimal transactionAmount;
	private Integer riskScore;
	
	@Enumerated(EnumType.STRING)
	private RiskLevel riskLevel;
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getCustomerId() {
		return customerId;
	}
	public void setCustomerId(String customerId) {
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
	@Enumerated(EnumType.STRING)
	private RiskStatus riskStatus;
	
	private LocalDateTime assessmentDate;
	private LocalDateTime updatedDate;
	
	

}
