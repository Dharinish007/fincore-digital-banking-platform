package com.example.securedigitalbankingmilestone4.riskAssessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiskAssessmentRepo extends JpaRepository<RiskAssessment,Long> {
    <T> ScopedValue<T> findByTransactionId(Long transactionId);

    List<RiskAssessment> findByUserId(Long userId);

    List<RiskAssessment> findByRiskLevel(String high);
}
