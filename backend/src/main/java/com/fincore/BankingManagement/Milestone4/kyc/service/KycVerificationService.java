package com.fincore.BankingManagement.Milestone4.kyc.service;

import com.fincore.BankingManagement.Entities.Customer;
import com.fincore.BankingManagement.Milestone1.account.repository.CustomerRepository;
import com.fincore.BankingManagement.Milestone4.kyc.dto.KycVerificationRequest;
import com.fincore.BankingManagement.Milestone4.kyc.dto.KycVerificationResponse;
import com.fincore.BankingManagement.Milestone4.kyc.model.KycStatus;
import com.fincore.BankingManagement.Milestone4.kyc.model.KycVerification;
import com.fincore.BankingManagement.Milestone4.kyc.repository.KycVerificationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class KycVerificationService {

    private final KycVerificationRepository kycVerificationRepository;

    private final CustomerRepository customerRepository;


    public KycVerificationService(
            KycVerificationRepository kycVerificationRepository,
            CustomerRepository customerRepository
    ) {

        this.kycVerificationRepository =
                kycVerificationRepository;

        this.customerRepository =
                customerRepository;
    }


    // ============================================================
    // VERIFY KYC
    // ============================================================

    @Transactional
    public KycVerificationResponse verifyKyc(
            KycVerificationRequest request
    ) {

        // --------------------------------------------------------
        // Validate customer ID
        // --------------------------------------------------------



        // --------------------------------------------------------
        // Create KYC verification record
        // --------------------------------------------------------

        KycVerification verification =
                new KycVerification();

        verification.setOcrPassed(
                request.isOcrPassed()
        );


        verification.setLivenessPassed(
                request.isLivenessPassed()
        );


        verification.setFaceMatchPassed(
                request.isFaceMatchPassed()
        );


        // --------------------------------------------------------
        // Audit reference
        // --------------------------------------------------------

        if (
                request.getAuditRef() != null
                        &&
                        !request.getAuditRef().isBlank()
        ) {

            verification.setAuditRef(
                    request.getAuditRef()
            );
        }


        // --------------------------------------------------------
        // Final KYC decision
        // --------------------------------------------------------

        boolean allPassed =
                request.isOcrPassed()
                        &&
                        request.isLivenessPassed()
                        &&
                        request.isFaceMatchPassed();


        if (allPassed) {

            verification.setKycStatus(
                    KycStatus.VERIFIED
            );

            verification.setVerifiedAt(
                    LocalDateTime.now()
            );

        } else {

            verification.setKycStatus(
                    KycStatus.REJECTED
            );

            verification.setVerifiedAt(null);
        }


        // --------------------------------------------------------
        // Save
        // --------------------------------------------------------

        KycVerification saved =
                kycVerificationRepository.save(
                        verification
                );


        // --------------------------------------------------------
        // Response
        // --------------------------------------------------------

        if (
                saved.getKycStatus()
                        == KycStatus.VERIFIED
        ) {

            return new KycVerificationResponse(

                    true,

                    "KYC verification successful",

                    saved.getKycId(),

                    saved.getCustomerId(),

                    saved.getKycStatus(),

                    saved.getAuditRef(),

                    saved.getVerifiedAt()
            );
        }


        return new KycVerificationResponse(

                false,

                "KYC verification failed. One or more verification stages did not pass.",

                saved.getKycId(),

                saved.getCustomerId(),

                saved.getKycStatus(),

                saved.getAuditRef(),

                saved.getVerifiedAt()
        );
    }


    // ============================================================
    // GET LATEST KYC STATUS
    // ============================================================

    public KycVerificationResponse getLatestKycStatus(
            Long customerId
    ) {

        // --------------------------------------------------------
        // Make sure customer exists
        // --------------------------------------------------------

        customerRepository
                .findById(customerId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Customer not found with ID: "
                                        + customerId
                        )
                );


        // --------------------------------------------------------
        // Get latest KYC record
        // --------------------------------------------------------

        KycVerification verification =
                kycVerificationRepository
                        .findTopByCustomerIdOrderByKycIdDesc(
                                customerId
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "KYC verification record not found for customer: "
                                                + customerId
                                )
                        );


        boolean verified =
                verification.getKycStatus()
                        == KycStatus.VERIFIED;


        return new KycVerificationResponse(

                verified,

                verified
                        ? "KYC verification successful"
                        : "KYC verification is not completed",

                verification.getKycId(),

                verification.getCustomerId(),

                verification.getKycStatus(),

                verification.getAuditRef(),

                verification.getVerifiedAt()
        );
    }
}