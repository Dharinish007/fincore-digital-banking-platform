package com.example.risk_scoring_service.service;

import java.util.List;

import com.example.risk_scoring_service.dto.RiskAssessmentRequestDTO;
import com.example.risk_scoring_service.dto.RiskAssessmentResponseDTO;
import com.example.risk_scoring_service.dto.RiskStatisticsDTO;
import com.example.risk_scoring_service.entity.RiskAssessmentHistory;
import com.example.risk_scoring_service.enums.RiskLevel;
import com.example.risk_scoring_service.enums.RiskStatus;

public interface RiskAssessmentService {

    RiskAssessmentResponseDTO createRiskAssessment(
            RiskAssessmentRequestDTO request);

    List<RiskAssessmentResponseDTO> getAllRiskAssessments();

    RiskAssessmentResponseDTO getRiskAssessmentById(
            Long riskId);

    RiskStatisticsDTO getRiskStatistics();

    RiskAssessmentResponseDTO reassessRisk(
            Long riskId);

    List<RiskAssessmentHistory> getRiskHistory(
            Long riskId);

    List<RiskAssessmentResponseDTO> searchRiskAssessments(
            String search,
            RiskLevel riskLevel,
            RiskStatus riskStatus);
}