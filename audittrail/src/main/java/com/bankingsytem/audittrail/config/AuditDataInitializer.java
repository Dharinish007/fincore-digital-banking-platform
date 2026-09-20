package com.bankingsytem.audittrail.config;

import com.bankingsytem.audittrail.model.AuditLog;
import com.bankingsytem.audittrail.repository.AuditLogRepository;
import com.bankingsytem.audittrail.service.AuditLogService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AuditDataInitializer implements CommandLineRunner {

    private final AuditLogRepository repository;
    private final AuditLogService service;

    public AuditDataInitializer(AuditLogRepository repository, AuditLogService service) {
        this.repository = repository;
        this.service = service;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            AuditLog log1 = new AuditLog();
            log1.setEntityName("CUSTOMER");
            log1.setEntityId("CUST-1001");
            log1.setAction("KYC_VERIFICATION");
            log1.setPerformedBy("TELLER-01");
            log1.setStatus("SUCCESS");
            log1.setDescription("Customer KYC documents verified successfully");
            log1.setTimestamp(LocalDateTime.now().minusHours(2));
            service.createLog(log1);

            AuditLog log2 = new AuditLog();
            log2.setEntityName("DISBURSEMENT");
            log2.setEntityId("SAGA-9001");
            log2.setAction("DISBURSE");
            log2.setPerformedBy("SYSTEM");
            log2.setStatus("SUCCESS");
            log2.setDescription("Loan disbursement of 5000.00 completed to account 2231-9087-4410");
            log2.setTimestamp(LocalDateTime.now().minusHours(1));
            service.createLog(log2);

            AuditLog log3 = new AuditLog();
            log3.setEntityName("SETTLEMENT");
            log3.setEntityId("SETTLE-2026-001");
            log3.setAction("CONFIRM_SETTLEMENT");
            log3.setPerformedBy("MGR-OPS-01");
            log3.setStatus("SUCCESS");
            log3.setDescription("Daily batch settlement confirmed");
            log3.setTimestamp(LocalDateTime.now().minusMinutes(30));
            service.createLog(log3);
        }
    }
}
