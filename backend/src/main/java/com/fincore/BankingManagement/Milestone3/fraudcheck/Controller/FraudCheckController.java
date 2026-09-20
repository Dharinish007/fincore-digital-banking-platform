package com.fincore.BankingManagement.Milestone3.fraudcheck.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fincore.BankingManagement.Milestone3.fraudcheck.models.FraudCheck;
import com.fincore.BankingManagement.Milestone3.fraudcheck.service.FraudCheckService;

@RestController
@RequestMapping("/fraud-check")
public class FraudCheckController {

    private final FraudCheckService fraudCheckService;

    public FraudCheckController(FraudCheckService fraudCheckService) {
        this.fraudCheckService = fraudCheckService;
    }


    // =========================================================
    // CREATE / PROCESS FRAUD CHECK
    // =========================================================

    @PostMapping
    public ResponseEntity<FraudCheck> processFraudCheck(
            @RequestBody FraudCheck fraudCheck) {

        FraudCheck processed =
                fraudCheckService.processFraudCheck(fraudCheck);

        return ResponseEntity.ok(processed);
    }


    // =========================================================
    // GET ALL FRAUD CHECKS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<FraudCheck>> getAllFraudChecks() {

        return ResponseEntity.ok(
                fraudCheckService.getAllFraudChecks()
        );
    }


    // =========================================================
    // GET PENDING FRAUD CHECKS
    // =========================================================

    @GetMapping("/pending")
    public ResponseEntity<List<FraudCheck>> getPendingFraudChecks() {

        return ResponseEntity.ok(
                fraudCheckService.getPendingFraudChecks()
        );
    }


    // =========================================================
    // GET FRAUD CHECK BY PAYMENT ID
    // =========================================================

    @GetMapping("/payment/{paymentId}")
    public ResponseEntity<FraudCheck> getFraudCheckByPaymentId(
            @PathVariable Long paymentId) {

        Optional<FraudCheck> fraudCheck =
                fraudCheckService.getFraudCheckByPaymentId(paymentId);

        return fraudCheck
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }


    // =========================================================
    // MARK SAFE
    // =========================================================

    @PutMapping("/{fraudCheckId}/safe")
    public ResponseEntity<FraudCheck> markSafe(
            @PathVariable Long fraudCheckId,
            @RequestBody(required = false) StatusRequest request) {

        String remarks =
                request != null
                        ? request.getRemarks()
                        : null;

        return ResponseEntity.ok(
                fraudCheckService.markSafe(
                        fraudCheckId,
                        remarks
                )
        );
    }


    // =========================================================
    // MARK SUSPICIOUS
    // =========================================================

    @PutMapping("/{fraudCheckId}/suspicious")
    public ResponseEntity<FraudCheck> markSuspicious(
            @PathVariable Long fraudCheckId,
            @RequestBody(required = false) StatusRequest request) {

        String remarks =
                request != null
                        ? request.getRemarks()
                        : null;

        return ResponseEntity.ok(
                fraudCheckService.markSuspicious(
                        fraudCheckId,
                        remarks
                )
        );
    }


    // =========================================================
    // BLOCK
    // =========================================================

    @PutMapping("/{fraudCheckId}/block")
    public ResponseEntity<FraudCheck> blockTransaction(
            @PathVariable Long fraudCheckId,
            @RequestBody(required = false) StatusRequest request) {

        String remarks =
                request != null
                        ? request.getRemarks()
                        : null;

        return ResponseEntity.ok(
                fraudCheckService.blockTransaction(
                        fraudCheckId,
                        remarks
                )
        );
    }


    // =========================================================
    // REQUEST DTO FOR STATUS UPDATE
    // =========================================================

    public static class StatusRequest {

        private String remarks;

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }
    }
}