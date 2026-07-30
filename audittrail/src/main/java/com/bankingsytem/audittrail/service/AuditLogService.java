package com.bankingsytem.audittrail.service;


import com.bankingsytem.audittrail.model.AuditLog;
import com.bankingsytem.audittrail.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    // create a new audit entry
    public AuditLog createLog(AuditLog auditLog) {
        auditLog.setTimestamp(LocalDateTime.now());
        return auditLogRepository.save(auditLog);
    }

    // get every log, most recent first
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    // get one log by its id
    public AuditLog getLogById(Long id) {
        return auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit log not found with id: " + id));
    }

    // get the full history for one entity, e.g. entityName="CUSTOMER", entityId="5"
    public List<AuditLog> getHistoryForEntity(String entityName, String entityId) {
        return auditLogRepository.findByEntityNameAndEntityIdOrderByTimestampDesc(entityName, entityId);
    }

    // get everything one user has done
    public List<AuditLog> getLogsByUser(String performedBy) {
        return auditLogRepository.findByPerformedByOrderByTimestampDesc(performedBy);
    }

    // get every log of a specific action type
    public List<AuditLog> getLogsByAction(String action) {
        return auditLogRepository.findByActionOrderByTimestampDesc(action);
    }
}
