package com.fincore.BankingManagement.Milestone4.facematchaccuracy.repository;

import com.fincore.BankingManagement.Milestone4.facematchaccuracy.model.FaceMatchVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FaceMatchVerificationRepository
        extends JpaRepository<FaceMatchVerification, Long> {
}