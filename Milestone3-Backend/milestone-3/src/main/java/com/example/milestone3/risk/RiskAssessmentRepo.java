package com.example.milestone3.risk;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;

public interface RiskAssessmentRepo extends JpaRepository<RiskAssessment, Long> {
    List<RiskAssessment> findAllByOrderByAssessedAtDesc();

    @Query(value = "SELECT id, customer_id, transaction_id, risk_score, decision, reasons, assessed_at, risk_level, analysis_source FROM risk_assessment ORDER BY assessed_at DESC", nativeQuery = true)
    List<Object[]> findHistoryRows();
}
