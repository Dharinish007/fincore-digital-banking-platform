package com.example.risk_scoring_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="risk_factor")
public class RiskFactor {
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getRiskAssessmentId() {
		return riskAssessmentId;
	}
	public void setRiskAssessmentId(Long riskAssessmentId) {
		this.riskAssessmentId = riskAssessmentId;
	}
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
	
		@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    
	    private Long riskAssessmentId;
	    private String factor;
	    private String description;
	

}
