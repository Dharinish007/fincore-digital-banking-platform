package com.example.risk_scoring_service.service;

import java.math.BigDecimal;

import com.example.risk_scoring_service.enums.RiskLevel;
import com.example.risk_scoring_service.enums.RiskStatus;

public interface RiskCalculationService {
	
	int calculateRiskScore(
			BigDecimal transactionAmount,
			int transactionFrequency,
			int latePayments,
			boolean unusualActivity);
	
	RiskLevel determineRiskLevel(int riskScore);
	RiskStatus determineRiskStstus(RiskLevel riskLevel);
	

}
