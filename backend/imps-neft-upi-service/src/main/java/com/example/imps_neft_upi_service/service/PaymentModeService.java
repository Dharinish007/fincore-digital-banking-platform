package com.example.imps_neft_upi_service.service;

import com.example.imps_neft_upi_service.dto.PaymentModeRequest;
import com.example.imps_neft_upi_service.dto.PaymentModeResponse;

public interface PaymentModeService {

    PaymentModeResponse processPayment(PaymentModeRequest request);

}