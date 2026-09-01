package com.example.risk_scoring_service.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.risk_scoring_service.entity.RiskAssessment;
import com.example.risk_scoring_service.enums.RiskLevel;
import com.example.risk_scoring_service.enums.RiskStatus;

public interface RiskAssessmentRepository
        extends JpaRepository<RiskAssessment, Long> {

    List<RiskAssessment> findByCustomerNameContainingIgnoreCase(
            String customerName);

    List<RiskAssessment> findByAccountNumber(
            String accountNumber);

    List<RiskAssessment> findByTransactionId(
            String transactionId);

    List<RiskAssessment> findByCustomerId(
            Long customerId);

    List<RiskAssessment> findByRiskLevel(
            RiskLevel riskLevel);

    List<RiskAssessment> findByRiskStatus(
            RiskStatus riskStatus);

    List<RiskAssessment> findByAssessmentDateBetween(
            LocalDateTime startDate,
            LocalDateTime endDate);
}