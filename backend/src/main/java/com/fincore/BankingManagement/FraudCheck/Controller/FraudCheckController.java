package com.fincore.BankingManagement.FraudCheck.Controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fincore.BankingManagement.FraudCheck.models.FraudCheck;
import com.fincore.BankingManagement.FraudCheck.service.FraudCheckService;

@RestController
@RequestMapping("/fraud-check")
public class FraudCheckController {

    private final FraudCheckService fraudCheckService;

    public FraudCheckController(FraudCheckService fraudCheckService) {
        this.fraudCheckService = fraudCheckService;
    }

    @PostMapping
    public ResponseEntity<FraudCheck> processFraudCheck(
            @RequestBody FraudCheck fraudCheck) {

        FraudCheck processed =
                fraudCheckService.processFraudCheck(fraudCheck);

        return ResponseEntity.ok(processed);
    }

    @GetMapping("/payment/{paymentId}")
    public ResponseEntity<FraudCheck> getFraudCheckByPaymentId(
            @PathVariable Long paymentId) {

        Optional<FraudCheck> fraudCheck =
                fraudCheckService.getFraudCheckByPaymentId(paymentId);

        return fraudCheck
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}