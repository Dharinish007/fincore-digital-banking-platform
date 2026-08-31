package com.example.risk_scoring_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.risk_scoring_service.entity.RiskFactor;


public interface RiskFactorRepository extends JpaRepository <RiskFactor, Long>{
	List<RiskFactor> findByRiskAssessmentId(Long riskAssessmentId);
}
