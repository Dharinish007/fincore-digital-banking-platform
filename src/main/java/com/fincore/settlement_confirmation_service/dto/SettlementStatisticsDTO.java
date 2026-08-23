package com.fincore.settlement_confirmation_service.dto;

import java.math.BigDecimal;

import lombok.Data;
@Data
public class SettlementStatisticsDTO {
	
	public long getPendingSettlements() {
		return pendingSettlements;
	}
	public void setPendingSettlements(long pendingSettlements) {
		this.pendingSettlements = pendingSettlements;
	}
	public long getConfirmedSettlements() {
		return confirmedSettlements;
	}
	public void setConfirmedSettlements(long confirmedSettlements) {
		this.confirmedSettlements = confirmedSettlements;
	}
	public BigDecimal getTotalSettlementValue() {
		return totalSettlementValue;
	}
	public void setTotalSettlementValue(BigDecimal totalSettlementValue) {
		this.totalSettlementValue = totalSettlementValue;
	}
	public long getTotalTransactions() {
		return totalTransactions;
	}
	public void setTotalTransactions(long totalTransactions) {
		this.totalTransactions = totalTransactions;
	}
	private long pendingSettlements;
    private long confirmedSettlements;
    private BigDecimal totalSettlementValue;
    private long totalTransactions;

}
