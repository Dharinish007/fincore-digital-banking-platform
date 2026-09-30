package com.fincore.repository;

import com.fincore.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {
    List<AuditLog> findByPerformedBy(String performedBy);
    List<AuditLog> findByEntityName(String entityName);
    List<AuditLog> findAllByOrderByCreatedAtDesc();
}
