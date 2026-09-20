package com.fincore.settlement_confirmation_service.dto;

import java.time.LocalDateTime;

import com.fincore.settlement_confirmation_service.enums.SettlementStatus;

import lombok.Data;

@Data
public class SettlementConfirmationResponseDTO {
	
	private String settlementId;
	private SettlementStatus status;
	private String managerId;
	public String getSettlementId() {
		return settlementId;
	}
	public void setSettlementId(String settlementId) {
		this.settlementId = settlementId;
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
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	private LocalDateTime confirmedAt;
	private String message;

}
