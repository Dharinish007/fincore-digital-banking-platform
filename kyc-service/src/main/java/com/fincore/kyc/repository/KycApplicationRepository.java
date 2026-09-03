package com.fincore.kyc.repository;

import com.fincore.kyc.entity.KycApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KycApplicationRepository
        extends JpaRepository<KycApplication, Long> {

    Optional<KycApplication> findByApplicationNumber(String applicationNumber);

    Optional<KycApplication> findByCustomerId(Long customerId);
}