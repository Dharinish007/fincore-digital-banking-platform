package com.example.securedigitalbankingmilestone4.auditLogging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditRepo extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUserId(Long userId);

    List<AuditLog> findByResourceId(Long transactionId);

    List<AuditLog> findRecentByUserId(Long userId);
}

