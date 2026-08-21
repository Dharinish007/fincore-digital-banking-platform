package com.fincore.payment.controller;

import com.fincore.payment.dto.PaymentRequest;
import com.fincore.payment.dto.PaymentResponse;
import com.fincore.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

  private final PaymentService paymentService;

  public PaymentController(
    PaymentService paymentService) {
    this.paymentService = paymentService;
  }

  @PostMapping
  public ResponseEntity<PaymentResponse> initiatePayment(
    @Valid @RequestBody PaymentRequest request) {

    PaymentResponse response =
      paymentService.initiatePayment(request);

    return new ResponseEntity<>(
      response,
      HttpStatus.CREATED
    );
  }

  @GetMapping("/{id}")
  public ResponseEntity<PaymentResponse> getPayment(
    @PathVariable Long id) {

    return ResponseEntity.ok(
      paymentService.getPayment(id)
    );
  }

  @GetMapping("/reference/{reference}")
  public ResponseEntity<PaymentResponse>
  getPaymentByReference(
    @PathVariable String reference) {

    return ResponseEntity.ok(
      paymentService
        .getPaymentByReference(reference)
    );
  }
}
