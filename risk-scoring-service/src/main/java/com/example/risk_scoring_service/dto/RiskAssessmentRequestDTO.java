package com.example.risk_scoring_service.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RiskAssessmentRequestDTO {
	@NotNull
	private Long customerId;
	
	@NotNull
	private String customerName;
	
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

	public List<RiskFactorDTO> getRiskFactors() {
		return riskFactors;
	}

	public void setRiskFactors(List<RiskFactorDTO> riskFactors) {
		this.riskFactors = riskFactors;
	}

	@NotNull
	private String accountNumber;
	
	@NotNull
    private String transactionId;

    @NotNull
    private BigDecimal transactionAmount;

    @Valid
    private List<RiskFactorDTO> riskFactors;
	
}
