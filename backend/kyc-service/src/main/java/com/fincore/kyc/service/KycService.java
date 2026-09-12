package com.fincore.kyc.service;

import com.fincore.kyc.entity.AuditLog;
import com.fincore.kyc.entity.KycApplication;
import com.fincore.kyc.repository.AuditLogRepository;
import com.fincore.kyc.repository.KycApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class KycService {

    private final KycApplicationRepository kycRepository;
    private final AuditLogRepository auditLogRepository;

    public KycService(
            KycApplicationRepository kycRepository,
            AuditLogRepository auditLogRepository) {

        this.kycRepository = kycRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public KycApplication createApplication(
            Long customerId,
            String fullName) {

        KycApplication application = new KycApplication();

        application.setCustomerId(customerId);
        application.setFullName(fullName);

        application.setApplicationNumber(
                "KYC-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase()
        );

        application.setStatus("PENDING");
        application.setRiskLevel("LOW");
        application.setOcrVerified(false);
        application.setLivenessVerified(false);
        application.setFaceMatchScore(0.0);
        application.setSubmittedAt(LocalDateTime.now());

        KycApplication saved =
                kycRepository.save(application);

        createAudit(
                saved.getId(),
                "KYC_APPLICATION_CREATED",
                "SYSTEM",
                "KYC application created"
        );

        return saved;
    }

    public KycApplication getApplication(Long id) {

        return kycRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "KYC application not found"
                        ));
    }

    public KycApplication verifyKyc(
            Long id,
            Double faceMatchScore) {

        KycApplication application =
                getApplication(id);

        application.setOcrVerified(true);
        application.setLivenessVerified(true);
        application.setFaceMatchScore(faceMatchScore);

        if (faceMatchScore >= 80) {

            application.setStatus("APPROVED");
            application.setRiskLevel("LOW");
            application.setApprovedAt(
                    LocalDateTime.now()
            );

        } else {

            application.setStatus("REJECTED");
            application.setRiskLevel("HIGH");
        }

        KycApplication updated =
                kycRepository.save(application);

        createAudit(
                id,
                "KYC_VERIFICATION",
                "SYSTEM",
                "KYC verification completed"
        );

        return updated;
    }

    private void createAudit(
            Long applicationId,
            String action,
            String performedBy,
            String details) {

        AuditLog log = new AuditLog();

        log.setKycApplicationId(applicationId);
        log.setAction(action);
        log.setPerformedBy(performedBy);
        log.setDetails(details);

        auditLogRepository.save(log);
    }
}