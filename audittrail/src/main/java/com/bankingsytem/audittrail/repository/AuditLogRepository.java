package com.bankingsytem.audittrail.repository;

import com.bankingsytem.audittrail.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    // Full history for one specific entity, e.g. all logs for CUSTOMER id=5
    List<AuditLog> findByEntityNameAndEntityIdOrderByTimestampDesc(String entityName, String entityId);

    // All actions performed by one user
    List<AuditLog> findByPerformedByOrderByTimestampDesc(String performedBy);

    // All logs for a given action type, e.g. all "LOGIN_FAILED"
    List<AuditLog> findByActionOrderByTimestampDesc(String action);

    // Get latest audit record for hash chaining
    Optional<AuditLog> findTopByOrderByIdDesc();

    // Get all records in chronological insertion order for integrity chain verification
    List<AuditLog> findAllByOrderByIdAsc();
}
