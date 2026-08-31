package com.example.risk_scoring_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.risk_scoring_service.entity.RiskAssessment;

public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment,Long>{

}
