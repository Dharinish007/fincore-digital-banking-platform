package com.fincore.BankingManagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @Column(name = "account_no", length = 30)
    private String accountNo;

    @Column(name = "event_time")
    private LocalDateTime eventTime;

    @Column(name = "log_level", length = 20)
    private String logLevel;

    @Column(name = "event_action", length = 100)
    private String eventAction;

    @Column(name = "performed_by", length = 100)
    private String performedBy;

    @Column(name = "remarks", length = 500)
    private String remarks;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @PrePersist
    public void prePersist() {
        if (eventTime == null) {
            eventTime = LocalDateTime.now();
        }
    }
}
