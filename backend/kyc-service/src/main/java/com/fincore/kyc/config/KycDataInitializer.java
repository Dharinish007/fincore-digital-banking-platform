package com.fincore.kyc.config;

import com.fincore.kyc.entity.KycApplication;
import com.fincore.kyc.repository.KycApplicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class KycDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(KycDataInitializer.class);
    private final KycApplicationRepository kycRepository;

    public KycDataInitializer(KycApplicationRepository kycRepository) {
        this.kycRepository = kycRepository;
    }

    @Override
    public void run(String... args) {
        if (kycRepository.count() == 0) {
            log.info("Seeding initial approved KYC applications in kyc-service...");

            KycApplication kyc1 = new KycApplication();
            kyc1.setCustomerId(1L);
            kyc1.setApplicationNumber("KYC-10000001");
            kyc1.setFullName("John Doe");
            kyc1.setStatus("APPROVED");
            kyc1.setRiskLevel("LOW");
            kyc1.setOcrVerified(true);
            kyc1.setLivenessVerified(true);
            kyc1.setFaceMatchScore(96.5);
            kyc1.setSubmittedAt(LocalDateTime.now().minusDays(10));
            kyc1.setApprovedAt(LocalDateTime.now().minusDays(9));
            kycRepository.save(kyc1);

            KycApplication kyc2 = new KycApplication();
            kyc2.setCustomerId(2L);
            kyc2.setApplicationNumber("KYC-10000002");
            kyc2.setFullName("Jane Smith");
            kyc2.setStatus("APPROVED");
            kyc2.setRiskLevel("LOW");
            kyc2.setOcrVerified(true);
            kyc2.setLivenessVerified(true);
            kyc2.setFaceMatchScore(92.0);
            kyc2.setSubmittedAt(LocalDateTime.now().minusDays(5));
            kyc2.setApprovedAt(LocalDateTime.now().minusDays(4));
            kycRepository.save(kyc2);

            log.info("Seeded 2 default approved KYC records (KYC-10000001 and KYC-10000002).");
        }
    }
}
