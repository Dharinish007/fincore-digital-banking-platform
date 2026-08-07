package com.fincore.BankingManagement.repository;

import com.fincore.BankingManagement.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByAccountNoOrderByEventTimeDesc(String accountNo);
}
