package com.fincore.kyc_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fincore.kyc_service.entity.Kyc;

@Repository
public interface KycRepository extends JpaRepository<Kyc, Long> {

}