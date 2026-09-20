package com.bankingsytem.audittrail;

import com.bankingsytem.audittrail.dto.AuditIntegrityResult;
import com.bankingsytem.audittrail.model.AuditLog;
import com.bankingsytem.audittrail.repository.AuditLogRepository;
import com.bankingsytem.audittrail.service.AuditLogService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AudittrailApplicationTests {

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Test
    void contextLoads() {
        assertNotNull(auditLogService);
    }

    @Test
    void testSha256AuditIntegrityChain() {
        // Verify that initialized logs form a valid cryptographic chain
        AuditIntegrityResult result = auditLogService.verifyIntegrity();
        assertTrue(result.isValid(), "Initial audit trail should have valid cryptographic integrity");
        assertEquals("VERIFIED", result.getStatus());
        assertTrue(result.getTotalRecords() >= 3);

        // Add a new log
        AuditLog newLog = new AuditLog();
        newLog.setEntityName("ACCOUNT");
        newLog.setEntityId("ACC-9999");
        newLog.setAction("FREEZE");
        newLog.setPerformedBy("SUPERVISOR");
        newLog.setStatus("SUCCESS");
        newLog.setDescription("Suspicious activity frozen");
        newLog.setTimestamp(LocalDateTime.now());

        AuditLog saved = auditLogService.createLog(newLog);
        assertNotNull(saved.getCurrentHash());
        assertNotNull(saved.getPreviousHash());
        assertEquals(64, saved.getCurrentHash().length(), "SHA-256 hex string should be 64 characters");

        // Verify chain remains valid after new entry
        AuditIntegrityResult afterAdd = auditLogService.verifyIntegrity();
        assertTrue(afterAdd.isValid());
    }

    @Test
    void testTamperDetection() {
        // Tamper with an existing record's description directly in database
        AuditLog record = auditLogRepository.findAll().get(0);
        String originalDesc = record.getDescription();

        try {
            record.setDescription("TAMPERED DATA INJECTION");
            auditLogRepository.save(record);

            AuditIntegrityResult tamperedCheck = auditLogService.verifyIntegrity();
            assertFalse(tamperedCheck.isValid(), "Tamper detection must fail verification when data is altered");
            assertEquals("TAMPERED", tamperedCheck.getStatus());
            assertEquals(record.getId(), tamperedCheck.getTamperedRecordId());
        } finally {
            // Restore original description
            record.setDescription(originalDesc);
            auditLogRepository.save(record);
        }
    }
}
