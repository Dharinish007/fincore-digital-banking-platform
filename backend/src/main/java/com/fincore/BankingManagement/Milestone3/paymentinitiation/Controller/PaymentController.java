package com.fincore.BankingManagement.Milestone3.paymentinitiation.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fincore.BankingManagement.Milestone3.paymentinitiation.entity.Payment;
import com.fincore.BankingManagement.Milestone3.paymentinitiation.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(
            PaymentService paymentService) {

        this.paymentService = paymentService;
    }

    // =========================================================
    // INITIATE PAYMENT
    // =========================================================

    @PostMapping
    public ResponseEntity<Payment> initiatePayment(
            @RequestBody Payment payment) {

        Payment savedPayment =
                paymentService.initiatePayment(payment);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedPayment);
    }

    // =========================================================
    // PROCESS PAYMENT
    // =========================================================

    @PostMapping("/{paymentId}/process")
    public ResponseEntity<Payment> processPayment(
            @PathVariable Long paymentId) {

        Payment processedPayment =
                paymentService.processPayment(paymentId);

        return ResponseEntity.ok(processedPayment);
    }

    // =========================================================
    // GET PAYMENT
    // =========================================================

    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPayment(
            @PathVariable Long paymentId) {

        return paymentService
                .getPaymentById(paymentId)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // =========================================================
    // GET ALL PAYMENTS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {

        return ResponseEntity.ok(
                paymentService.getAllPayments()
        );
    }

    // =========================================================
    // GET PAYMENT BY TRANSACTION REFERENCE
    // =========================================================

    @GetMapping("/transaction/{transactionRef}")
    public ResponseEntity<Payment> getByTransactionRef(
            @PathVariable String transactionRef) {

        return paymentService
                .getPaymentByTransactionRef(transactionRef)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }
}