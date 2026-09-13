package com.example.milestone3.audit;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String username;

    @Column(name = "\"user\"")
    private String actor;
    private String action;
    private String module;
    private String status;
    @Column(name = "entity")
    private String entityType;
    private String entityId;
    private String details;
    @Column(columnDefinition = "TEXT")
    private String metadata;
    @Column(name = "ip")
    private String ipAddress;
    @Column(name = "\"timestamp\"")
    private LocalDateTime createdAt;

    public AuditLog(Long id, String actor, String action, String entityType, String entityId,
                    String details, String ipAddress, LocalDateTime createdAt) {
        this.id = id;
        this.username = actor;
        this.actor = actor;
        this.action = action;
        this.module = entityType;
        this.status = "SUCCESS";
        this.entityType = entityType;
        this.entityId = entityId;
        this.details = details;
        this.ipAddress = ipAddress;
        this.createdAt = createdAt;
    }

    public String getModule() {
        if (module != null && !module.isBlank()) {
            return module;
        }
        if (entityType != null && !entityType.isBlank()) {
            return entityType;
        }
        return "GENERAL";
    }

    public String getStatus() {
        if (status != null && !status.isBlank()) {
            return status;
        }
        return "SUCCESS";
    }

    public String getUsername() {
        if (username != null && !username.isBlank()) {
            return username;
        }
        if (actor != null && !actor.isBlank()) {
            return actor;
        }
        return "SYSTEM";
    }
}
