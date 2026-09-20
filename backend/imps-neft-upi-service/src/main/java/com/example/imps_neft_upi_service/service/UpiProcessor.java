package com.example.imps_neft_upi_service.service;

import com.example.imps_neft_upi_service.dto.PaymentModeRequest;
import com.example.imps_neft_upi_service.dto.PaymentModeResponse;
import com.example.imps_neft_upi_service.enums.PaymentStatus;
import org.springframework.stereotype.Service;

@Service
public class UpiProcessor implements PaymentProcessor {

    @Override
    public PaymentModeResponse process(
            PaymentModeRequest request) {

        PaymentModeResponse response =
                new PaymentModeResponse();

        response.setPaymentReference(
                request.getPaymentReference());

        response.setPaymentMode(
                request.getPaymentMode());

        // UPI ID validation
        if (request.getUpiId() == null ||
                request.getUpiId().isBlank() ||
                !request.getUpiId().contains("@")) {

            response.setStatus(PaymentStatus.FAILED);

            response.setMessage(
                    "UPI payment processing failed");

            return response;
        }

        // UPI processing
        response.setStatus(PaymentStatus.SUCCESS);

        response.setMessage(
                "UPI payment processed successfully");

        return response;
    }
}