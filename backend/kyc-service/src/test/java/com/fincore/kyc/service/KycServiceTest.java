package com.fincore.kyc.service;

import com.fincore.kyc.entity.AuditLog;
import com.fincore.kyc.entity.KycApplication;
import com.fincore.kyc.repository.AuditLogRepository;
import com.fincore.kyc.repository.KycApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KycServiceTest {

    @Mock
    private KycApplicationRepository kycRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private KycService kycService;

    private KycApplication testApp;

    @BeforeEach
    void setUp() {
        testApp = new KycApplication();
        testApp.setId(1L);
        testApp.setCustomerId(100L);
        testApp.setFullName("John Doe");
        testApp.setApplicationNumber("KYC-ABC12345");
        testApp.setStatus("PENDING");
        testApp.setRiskLevel("LOW");
        testApp.setFaceMatchScore(0.0);
    }

    @Test
    @DisplayName("createApplication - successfully persists application and audit log")
    void testCreateApplication() {
        when(kycRepository.save(any(KycApplication.class))).thenAnswer(invocation -> {
            KycApplication app = invocation.getArgument(0);
            app.setId(1L);
            return app;
        });
        when(auditLogRepository.save(any(AuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        KycApplication result = kycService.createApplication(100L, "John Doe");

        assertNotNull(result);
        assertEquals(100L, result.getCustomerId());
        assertEquals("John Doe", result.getFullName());
        assertEquals("PENDING", result.getStatus());
        assertTrue(result.getApplicationNumber().startsWith("KYC-"));

        verify(kycRepository, times(1)).save(any(KycApplication.class));
        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }

    @Test
    @DisplayName("getApplication - returns application when found")
    void testGetApplicationFound() {
        when(kycRepository.findById(1L)).thenReturn(Optional.of(testApp));

        KycApplication result = kycService.getApplication(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("John Doe", result.getFullName());
    }

    @Test
    @DisplayName("getApplication - throws exception when not found")
    void testGetApplicationNotFound() {
        when(kycRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> kycService.getApplication(99L));
    }

    @Test
    @DisplayName("verifyKyc - approves application when score >= 80")
    void testVerifyKycApproved() {
        when(kycRepository.findById(1L)).thenReturn(Optional.of(testApp));
        when(kycRepository.save(any(KycApplication.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(auditLogRepository.save(any(AuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        KycApplication result = kycService.verifyKyc(1L, 92.5);

        assertNotNull(result);
        assertEquals("APPROVED", result.getStatus());
        assertEquals("LOW", result.getRiskLevel());
        assertEquals(92.5, result.getFaceMatchScore());
        assertTrue(Boolean.TRUE.equals(result.getOcrVerified()));
        assertTrue(Boolean.TRUE.equals(result.getLivenessVerified()));
        assertNotNull(result.getApprovedAt());
    }

    @Test
    @DisplayName("verifyKyc - rejects application when score < 80")
    void testVerifyKycRejected() {
        when(kycRepository.findById(1L)).thenReturn(Optional.of(testApp));
        when(kycRepository.save(any(KycApplication.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(auditLogRepository.save(any(AuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        KycApplication result = kycService.verifyKyc(1L, 65.0);

        assertNotNull(result);
        assertEquals("REJECTED", result.getStatus());
        assertEquals("HIGH", result.getRiskLevel());
        assertEquals(65.0, result.getFaceMatchScore());
        assertNull(result.getApprovedAt());
    }
}
