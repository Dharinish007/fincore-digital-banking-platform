package com.example.risk_scoring_service.entity;

import jakarta.persistence.Entity;

import java.time.LocalDateTime;

import com.example.risk_scoring_service.enums.RiskLevel;
import com.example.risk_scoring_service.enums.RiskStatus;

import jakarta.persistence.*;

@Entity
@Table(name ="risk_assessment_history" )
public class RiskAssessmentHistory {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long riskAssessmentId;

    private Integer riskScore;

    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;

    @Enumerated(EnumType.STRING)
    private RiskStatus riskStatus;

    private LocalDateTime assessmentDate;
}
