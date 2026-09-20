package com.bankingsytem.audittrail.service;

import com.bankingsytem.audittrail.dto.AuditIntegrityResult;
import com.bankingsytem.audittrail.model.AuditLog;
import com.bankingsytem.audittrail.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    public static final String GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

    private final AuditLogRepository auditLogRepository;

    /**
     * Creates a new audit entry with SHA-256 cryptographic chaining.
     */
    public AuditLog createLog(AuditLog auditLog) {
        if (auditLog.getTimestamp() == null) {
            auditLog.setTimestamp(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
        } else {
            auditLog.setTimestamp(auditLog.getTimestamp().truncatedTo(ChronoUnit.SECONDS));
        }

        // 1. Fetch previous hash in the chain
        Optional<AuditLog> latestLog = auditLogRepository.findTopByOrderByIdDesc();
        String prevHash = latestLog.map(AuditLog::getCurrentHash).orElse(GENESIS_HASH);
        auditLog.setPreviousHash(prevHash);

        // 2. Compute SHA-256 hash of the meaningful payload
        String payload = buildPayload(
                auditLog.getEntityName(),
                auditLog.getEntityId(),
                auditLog.getAction(),
                auditLog.getPerformedBy(),
                auditLog.getStatus(),
                auditLog.getDescription(),
                auditLog.getTimestamp().toString(),
                prevHash
        );
        auditLog.setCurrentHash(calculateSha256(payload));

        return auditLogRepository.save(auditLog);
    }

    /**
     * Verifies the cryptographic integrity of the entire audit trail chain.
     */
    public AuditIntegrityResult verifyIntegrity() {
        List<AuditLog> logs = auditLogRepository.findAllByOrderByIdAsc();

        if (logs.isEmpty()) {
            return new AuditIntegrityResult(true, 0, null, "VERIFIED", "Audit log is empty. Genesis state intact.");
        }

        String expectedPrevHash = GENESIS_HASH;

        for (AuditLog log : logs) {
            // Check 1: Chain continuity - does previousHash match prior currentHash?
            if (!expectedPrevHash.equalsIgnoreCase(log.getPreviousHash())) {
                return new AuditIntegrityResult(
                        false,
                        logs.size(),
                        log.getId(),
                        "TAMPERED",
                        "Chain broken at record ID " + log.getId() + ". Expected previousHash: "
                                + expectedPrevHash + ", but found: " + log.getPreviousHash()
                );
            }

            // Check 2: Block integrity - does currentHash match recalculation from record data?
            String timeStr = log.getTimestamp() != null
                    ? log.getTimestamp().truncatedTo(ChronoUnit.SECONDS).toString()
                    : "";

            String payload = buildPayload(
                    log.getEntityName(),
                    log.getEntityId(),
                    log.getAction(),
                    log.getPerformedBy(),
                    log.getStatus(),
                    log.getDescription(),
                    timeStr,
                    log.getPreviousHash()
            );
            String calculatedHash = calculateSha256(payload);

            if (!calculatedHash.equalsIgnoreCase(log.getCurrentHash())) {
                return new AuditIntegrityResult(
                        false,
                        logs.size(),
                        log.getId(),
                        "TAMPERED",
                        "Cryptographic hash mismatch at record ID " + log.getId() + ". Calculated: "
                                + calculatedHash + ", but record currentHash: " + log.getCurrentHash()
                );
            }

            expectedPrevHash = log.getCurrentHash();
        }

        return new AuditIntegrityResult(
                true,
                logs.size(),
                null,
                "VERIFIED",
                "Audit trail integrity verified: All " + logs.size() + " records are cryptographically intact."
        );
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    public AuditLog getLogById(Long id) {
        return auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit log not found with id: " + id));
    }

    public List<AuditLog> getHistoryForEntity(String entityName, String entityId) {
        return auditLogRepository.findByEntityNameAndEntityIdOrderByTimestampDesc(entityName, entityId);
    }

    public List<AuditLog> getLogsByUser(String performedBy) {
        return auditLogRepository.findByPerformedByOrderByTimestampDesc(performedBy);
    }

    public List<AuditLog> getLogsByAction(String action) {
        return auditLogRepository.findByActionOrderByTimestampDesc(action);
    }

    public String calculateSha256(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available in runtime", e);
        }
    }

    public String buildPayload(String entityName, String entityId, String action, String performedBy,
                               String status, String description, String timestamp, String prevHash) {
        return (entityName != null ? entityName : "") + "|"
                + (entityId != null ? entityId : "") + "|"
                + (action != null ? action : "") + "|"
                + (performedBy != null ? performedBy : "") + "|"
                + (status != null ? status : "") + "|"
                + (description != null ? description : "") + "|"
                + (timestamp != null ? timestamp : "") + "|"
                + (prevHash != null ? prevHash : "");
    }
}
