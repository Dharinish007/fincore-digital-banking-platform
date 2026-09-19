package com.fincore.BankingManagement.Milestone4.kyc.controller;

import com.fincore.BankingManagement.Milestone4.kyc.dto.KycVerificationRequest;
import com.fincore.BankingManagement.Milestone4.kyc.dto.KycVerificationResponse;
import com.fincore.BankingManagement.Milestone4.kyc.service.KycVerificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kyc")
@CrossOrigin(origins = "http://localhost:4200")
public class KycVerificationController {

    private final KycVerificationService kycVerificationService;


    public KycVerificationController(
            KycVerificationService kycVerificationService
    ) {

        this.kycVerificationService =
                kycVerificationService;
    }


    // ============================================================
    // VERIFY KYC
    // ============================================================

    @PostMapping("/verify")
    public ResponseEntity<KycVerificationResponse> verifyKyc(
            @RequestBody KycVerificationRequest request
    ) {

        KycVerificationResponse response =
                kycVerificationService.verifyKyc(
                        request
                );


        if (response.isSuccess()) {

            return ResponseEntity.ok(response);
        }


        return ResponseEntity
                .badRequest()
                .body(response);
    }


    // ============================================================
    // GET KYC STATUS
    // ============================================================

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<KycVerificationResponse> getKycStatus(
            @PathVariable Long customerId
    ) {

        return ResponseEntity.ok(
                kycVerificationService
                        .getLatestKycStatus(
                                customerId
                        )
        );
    }
}