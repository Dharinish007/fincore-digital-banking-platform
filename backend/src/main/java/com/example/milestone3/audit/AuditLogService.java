package com.example.milestone3.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    private final AuditLogRepo repository;

    public AuditLog record(String actor, String action, String entityType, String entityId, String details, String ipAddress) {
        return repository.save(new AuditLog(null, actor, action, entityType, entityId, details, ipAddress, LocalDateTime.now()));
    }

    public AuditLog record(Long userId, String username, String action, String module,
                           String entityType, String entityId, String details,
                           String status, String ipAddress) {
        AuditLog log = new AuditLog();
        log.setUserId(userId);
        log.setUsername(username);
        log.setActor(username);
        log.setAction(action);
        log.setModule(module);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDetails(details);
        log.setStatus(status);
        log.setIpAddress(ipAddress);
        log.setCreatedAt(LocalDateTime.now());
        return repository.save(log);
    }
}
