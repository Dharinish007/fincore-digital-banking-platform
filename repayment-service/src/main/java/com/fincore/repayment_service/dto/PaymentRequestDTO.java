package com.fincore.repayment_service.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class PaymentRequestDTO {
	private Long loanId;
	private Long emiId;
	
	private BigDecimal amountPaid;
	private String paymentMethod;
	
	public Long getLoanId() {
		return loanId;
	}
	public void setLoanId(Long loanId) {
		this.loanId = loanId;
	}
	public Long getEmiId() {
		return emiId;
	}
	public void setEmiId(Long emiId) {
		this.emiId = emiId;
	}
	public BigDecimal getAmountPaid() {
		return amountPaid;
	}
	public void setAmountPaid(BigDecimal amountPaid) {
		this.amountPaid = amountPaid;
	}
	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}
	public String getPaymentMethod() {
		// TODO Auto-generated method stub
		return null;
	}
	
}
