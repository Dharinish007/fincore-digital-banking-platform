package com.example.risk_scoring_service.dto;

import lombok.Data;

@Data
public class RiskFactorDTO {
	private String factor;
	private String description;
	public String getFactor() {
		return factor;
	}
	public void setFactor(String factor) {
		this.factor = factor;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
}
