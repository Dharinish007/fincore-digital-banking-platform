package com.fincore.loan.repository;

import com.fincore.loan.entity.CreditAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CreditAssessmentRepository extends JpaRepository<CreditAssessment, Long> {

    Optional<CreditAssessment> findByApplicationId(Long applicationId);

    boolean existsByApplicationId(Long applicationId);
}
