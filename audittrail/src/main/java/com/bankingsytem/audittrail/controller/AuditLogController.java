package com.bankingsytem.audittrail.controller;

import com.bankingsytem.audittrail.dto.AuditIntegrityResult;
import com.bankingsytem.audittrail.model.AuditLog;
import com.bankingsytem.audittrail.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/audit", "/api/audit-logs"})
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    // POST /api/v1/audit or /api/audit-logs -> create a new cryptographically chained audit entry
    @PostMapping
    public ResponseEntity<AuditLog> createLog(@RequestBody AuditLog auditLog) {
        AuditLog saved = auditLogService.createLog(auditLog);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // GET /api/v1/audit/verify or /api/audit-logs/verify -> verify SHA-256 cryptographic chain
    @GetMapping("/verify")
    public ResponseEntity<AuditIntegrityResult> verifyIntegrity() {
        return ResponseEntity.ok(auditLogService.verifyIntegrity());
    }

    // GET /api/v1/audit or /api/audit-logs -> get all logs
    @GetMapping
    public List<AuditLog> getAllLogs() {
        return auditLogService.getAllLogs();
    }

    // GET /api/v1/audit/1 -> get one log by id
    @GetMapping("/{id}")
    public AuditLog getLogById(@PathVariable Long id) {
        return auditLogService.getLogById(id);
    }

    // GET /api/v1/audit/entity/CUSTOMER/5 -> full history for one record
    @GetMapping("/entity/{entityName}/{entityId}")
    public List<AuditLog> getHistoryForEntity(@PathVariable String entityName,
                                              @PathVariable String entityId) {
        return auditLogService.getHistoryForEntity(entityName, entityId);
    }

    // GET /api/v1/audit/user/teller01 -> everything one user did
    @GetMapping("/user/{performedBy}")
    public List<AuditLog> getLogsByUser(@PathVariable String performedBy) {
        return auditLogService.getLogsByUser(performedBy);
    }

    // GET /api/v1/audit/action/LOGIN_FAILED -> all logs of one action type
    @GetMapping("/action/{action}")
    public List<AuditLog> getLogsByAction(@PathVariable String action) {
        return auditLogService.getLogsByAction(action);
    }
}
