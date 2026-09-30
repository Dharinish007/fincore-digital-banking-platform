package com.fincore.service;

import com.fincore.entity.AuditLog;
import com.fincore.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public AuditLog recordAudit(String actionType, String entityName, String entityId, String performedBy, String userRole, String details) {
        AuditLog log = AuditLog.builder()
                .actionType(actionType)
                .entityName(entityName)
                .entityId(entityId)
                .performedBy(performedBy != null ? performedBy : "SYSTEM")
                .userRole(userRole != null ? userRole : "ADMIN")
                .ipAddress("127.0.0.1")
                .status("SUCCESS")
                .details(details)
                .build();

        return auditLogRepository.save(log);
    }

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc();
    }
}
