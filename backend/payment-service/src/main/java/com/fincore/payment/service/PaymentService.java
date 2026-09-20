package com.fincore.payment.service;

import com.fincore.payment.dto.PaymentRequest;
import com.fincore.payment.dto.PaymentResponse;
import com.fincore.payment.enums.PaymentStatus;

import java.util.List;

public interface PaymentService {

    PaymentResponse initiatePayment(PaymentRequest request);

    PaymentResponse getPayment(Long id);

    PaymentResponse getPaymentByReference(String reference);

    List<PaymentResponse> getPaymentsByCustomerId(Long customerId);

    List<PaymentResponse> getPaymentsByStatus(PaymentStatus status);

    List<PaymentResponse> getAllPayments();
}
