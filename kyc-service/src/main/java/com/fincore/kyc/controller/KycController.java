package com.fincore.kyc.controller;

import com.fincore.kyc.entity.KycApplication;
import com.fincore.kyc.service.KycService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kyc")
public class KycController {

    private final KycService kycService;

    public KycController(KycService kycService) {
        this.kycService = kycService;
    }

    @PostMapping("/application")
    public ResponseEntity<KycApplication> createApplication(
            @RequestParam Long customerId,
            @RequestParam String fullName) {

        return ResponseEntity.ok(
                kycService.createApplication(
                        customerId,
                        fullName
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<KycApplication> getApplication(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                kycService.getApplication(id)
        );
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<KycApplication> verifyKyc(
            @PathVariable Long id,
            @RequestParam Double faceMatchScore) {

        return ResponseEntity.ok(
                kycService.verifyKyc(
                        id,
                        faceMatchScore
                )
        );
    }
}