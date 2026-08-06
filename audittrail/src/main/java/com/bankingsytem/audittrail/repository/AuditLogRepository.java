package com.bankingsytem.audittrail.repository;


import com.bankingsytem.audittrail.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface AuditLogRepository extends JpaRepository<AuditLog, Long>{

    // full history for one specific entity, e.g. all logs for CUSTOMER id=5
    List<AuditLog> findByEntityNameAndEntityIdOrderByTimestampDesc(String entityName, String entityId);

    // all actions performed by one user
    List<AuditLog> findByPerformedByOrderByTimestampDesc(String performedBy);

    // all logs for a given action type, e.g. all "LOGIN_FAILED"
    List<AuditLog> findByActionOrderByTimestampDesc(String action);
}
