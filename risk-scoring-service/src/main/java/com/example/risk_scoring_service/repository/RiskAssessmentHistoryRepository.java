package com.example.risk_scoring_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.risk_scoring_service.entity.RiskAssessmentHistory;

public interface RiskAssessmentHistoryRepository extends JpaRepository<RiskAssessmentHistory, Long> {
	List<RiskAssessmentHistory>
    findByRiskAssessmentId(Long riskAssessmentId);
}
