package com.fincore.settlement_confirmation_service.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fincore.settlement_confirmation_service.enums.SettlementStatus;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class SettlementResponseDTO {
	
	private String settlementId;
	private String transactionReference;
	private String customerName;
	private String accountNumber;
	private BigDecimal settlementAmount;
	private LocalDate settlementDate;
	public String getSettlementId() {
		return settlementId;
	}
	public void setSettlementId(String settlementId) {
		this.settlementId = settlementId;
	}
	public String getTransactionReference() {
		return transactionReference;
	}
	public void setTransactionReference(String transactionReference) {
		this.transactionReference = transactionReference;
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
	public BigDecimal getSettlementAmount() {
		return settlementAmount;
	}
	public void setSettlementAmount(BigDecimal settlementAmount) {
		this.settlementAmount = settlementAmount;
	}
	public LocalDate getSettlementDate() {
		return settlementDate;
	}
	public void setSettlementDate(LocalDate settlementDate) {
		this.settlementDate = settlementDate;
	}
	public Integer getTransactionCount() {
		return transactionCount;
	}
	public void setTransactionCount(Integer transactionCount) {
		this.transactionCount = transactionCount;
	}
	public SettlementStatus getStatus() {
		return status;
	}
	public void setStatus(SettlementStatus status) {
		this.status = status;
	}
	public String getManagerId() {
		return managerId;
	}
	public void setManagerId(String managerId) {
		this.managerId = managerId;
	}
	public LocalDateTime getConfirmedAt() {
		return confirmedAt;
	}
	public void setConfirmedAt(LocalDateTime confirmedAt) {
		this.confirmedAt = confirmedAt;
	}
	private Integer transactionCount;
	private SettlementStatus status;
	private String managerId;
	private LocalDateTime confirmedAt;

}
