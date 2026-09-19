package com.fincore.BankingManagement.Milestone4.kyc.repository;

import com.fincore.BankingManagement.Milestone4.kyc.model.KycVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KycVerificationRepository
        extends JpaRepository<KycVerification, Long> {

    Optional<KycVerification> findTopByCustomerIdOrderByKycIdDesc(
            Long customerId
    );
}