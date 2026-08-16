package com.fincore.repayment_service.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class OutstandingDTO {
	private BigDecimal totalLoanAmount;
	private BigDecimal amountPaid;
	private BigDecimal remainingAmount;
	public BigDecimal getTotalLoanAmount() {
		return totalLoanAmount;
	}
	public void setTotalLoanAmount(BigDecimal totalLoanAmount) {
		this.totalLoanAmount = totalLoanAmount;
	}
	public BigDecimal getAmountPaid() {
		return amountPaid;
	}
	public void setAmountPaid(BigDecimal amountPaid) {
		this.amountPaid = amountPaid;
	}
	public BigDecimal getRemainingAmount() {
		return remainingAmount;
	}
	public void setRemainingAmount(BigDecimal remainingAmount) {
		this.remainingAmount = remainingAmount;
	}
	
}
