package com.example.risk_scoring_service.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.example.risk_scoring_service.enums.RiskLevel;
import com.example.risk_scoring_service.enums.RiskStatus;

@Service
public class RiskCalculationServiceImpl implements RiskCalculationService {

	@Override
	public int calculateRiskScore(BigDecimal transactionAmount, int transactionFrequency, int latePayments,
			boolean unusualActivity) {
		
		int score=0;
		if(transactionAmount.compareTo(new BigDecimal("50000"))>0) {
			score+=30;
		}
		else if(transactionAmount.compareTo(new BigDecimal("2000") )>0) {
			score+=15;
		}
		
		if (transactionFrequency > 10) {
            score += 25;
        } else if (transactionFrequency > 5) {
            score += 15;
        }
		
		if (latePayments >= 3) {
            score += 25;
        } else if (latePayments > 0) {
            score += 15;
        }
		
		 if (unusualActivity) {
	            score += 20;
	        }
		return Math.min(score, 100);
	}

	@Override
	public RiskLevel determineRiskLevel(int riskScore) {
		if(riskScore >= 70) {
			return RiskLevel.HIGH;
		}
		else if(riskScore >=40) {
			return RiskLevel.MEDIUM;
		}
		else {
			return RiskLevel.LOW;
		}
		
	}

	@Override
	public RiskStatus determineRiskStstus(RiskLevel riskLevel) {
		switch(riskLevel) {
		case HIGH:
			return RiskStatus.FLAGGED;

        case MEDIUM:
            return RiskStatus.REVIEW;

        case LOW:
            return RiskStatus.SAFE;

        default:
            throw new IllegalArgumentException(
                    "Invalid risk level");
		}
	}
	
	
	
	
	
	
}
