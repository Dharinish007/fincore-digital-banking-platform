package com.fincore.BankingManagement.Milestone4.livenessdetection.repository;

import com.fincore.BankingManagement.Milestone4.livenessdetection.model.LivenessVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivenessVerificationRepository
        extends JpaRepository<LivenessVerification, Long> {
}