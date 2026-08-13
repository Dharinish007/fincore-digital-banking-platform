package com.bankingsystem.disbursementsaga.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AuditLogRequest {
    //mirrors the AuditLog entity in audittrail

    private String entityName;
    private String entityId;
    private String action;
    private String performedBy;
    private String status;
    private String description;
    private LocalDateTime timestamp;

}
