package com.example.imps_neft_upi_service.controller;

import com.example.imps_neft_upi_service.dto.PaymentModeRequest;
import com.example.imps_neft_upi_service.dto.PaymentModeResponse;
import com.example.imps_neft_upi_service.service.PaymentModeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment-modes")
public class PaymentModeController {

    private final PaymentModeService paymentModeService;

    public PaymentModeController(PaymentModeService paymentModeService) {
        this.paymentModeService = paymentModeService;
    }

    @PostMapping("/process")
    public ResponseEntity<PaymentModeResponse> processPayment(
            @Valid @RequestBody PaymentModeRequest request) {

        PaymentModeResponse response =
                paymentModeService.processPayment(request);

        return ResponseEntity.ok(response);
    }
}