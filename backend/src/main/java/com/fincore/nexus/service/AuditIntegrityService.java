package com.fincore.nexus.service;

import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

/**
 * Milestone 4: Cryptographic Audit Integrity Service
 * Generates SHA-256 hash chains and performs cryptographic tamper detection
 * across audit trail records.
 */
@Service
public class AuditIntegrityService {

    private static final String GENESIS_PREV_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

    /**
     * Computes SHA-256 cryptographic hash from string payload using Java MessageDigest
     */
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
            throw new RuntimeException("SHA-256 algorithm not available in Java runtime", e);
        }
    }

    /**
     * Builds structured block payload string for hashing
     */
    public String buildPayload(long index, String timestamp, String user, String role, String action, String details, String prevHash) {
        return index + "|" + timestamp + "|" + user + "|" + role + "|" + action + "|" + details + "|" + prevHash;
    }

    /**
     * Verification Result DTO
     */
    public record VerificationResult(
        boolean isValid,
        int totalBlocks,
        Integer tamperedIndex,
        String details,
        String status
    ) {}
}
