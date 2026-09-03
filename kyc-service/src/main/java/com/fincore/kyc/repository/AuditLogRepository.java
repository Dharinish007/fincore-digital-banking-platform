package com.fincore.kyc.repository;

import com.fincore.kyc.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByKycApplicationId(Long kycApplicationId);
}