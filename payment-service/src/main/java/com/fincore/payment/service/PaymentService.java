package com.fincore.payment.service;

import com.fincore.payment.dto.PaymentRequest;
import com.fincore.payment.dto.PaymentResponse;

public interface PaymentService {

  PaymentResponse initiatePayment(
    PaymentRequest request
  );

  PaymentResponse getPayment(
    Long id
  );

  PaymentResponse getPaymentByReference(
    String reference
  );
}
