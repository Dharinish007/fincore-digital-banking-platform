package com.fincore.repayment_service.dto;

import java.math.BigDecimal;


public class DashboardDTO {
	private BigDecimal totalPaid;
	private BigDecimal totalOutstanding;
	private String nextEmiDate;
	private Integer paidEmiCount;
	private Integer remainingEmiCount;
	private Double progressPercentage;
	private String riskIndicator;
	public BigDecimal getTotalPaid() {
		return totalPaid;
	}
	public void setTotalPaid(BigDecimal totalPaid) {
		this.totalPaid = totalPaid;
	}
	public BigDecimal getTotalOutstanding() {
		return totalOutstanding;
	}
	public void setTotalOutstanding(BigDecimal totalOutstanding) {
		this.totalOutstanding = totalOutstanding;
	}
	public String getNextEmiDate() {
		return nextEmiDate;
	}
	public void setNextEmiDate(String nextEmiDate) {
		this.nextEmiDate = nextEmiDate;
	}
	public Integer getPaidEmiCount() {
		return paidEmiCount;
	}
	public void setPaidEmiCount(Integer paidEmiCount) {
		this.paidEmiCount = paidEmiCount;
	}
	public Integer getRemainingEmiCount() {
		return remainingEmiCount;
	}
	public void setRemainingEmiCount(Integer remainingEmiCount) {
		this.remainingEmiCount = remainingEmiCount;
	}
	public Double getProgressPercentage() {
		return progressPercentage;
	}
	public void setProgressPercentage(Double progressPercentage) {
		this.progressPercentage = progressPercentage;
	}
	public String getRiskIndicator() {
		return riskIndicator;
	}
	public void setRiskIndicator(String riskIndicator) {
		this.riskIndicator = riskIndicator;
	}

}
