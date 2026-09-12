package com.example.securedigitalbankingmilestone4.auditLogging;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {
    @Autowired
    private AuditRepo repo;
    public AuditLog createLog(AuditLog auditLog) {
        return repo.save(auditLog);
    }

    public List<AuditLog> getAllLogs() {
        return repo.findAll();
    }

    public List<AuditLog> getLogByUser(Long userId) {
        return repo.findByUserId(userId);
    }

    public List<AuditLog> getLogsByTransactionId(Long transactionId) {
        return repo.findByResourceId(transactionId);
    }
}
