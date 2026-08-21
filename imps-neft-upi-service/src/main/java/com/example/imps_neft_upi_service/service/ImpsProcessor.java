package com.example.imps_neft_upi_service.service;

import com.example.imps_neft_upi_service.dto.PaymentModeRequest;
import com.example.imps_neft_upi_service.dto.PaymentModeResponse;
import com.example.imps_neft_upi_service.enums.PaymentStatus;
import org.springframework.stereotype.Service;

@Service
public class ImpsProcessor implements PaymentProcessor {

    @Override
    public PaymentModeResponse process(
            PaymentModeRequest request) {

        PaymentModeResponse response =
                new PaymentModeResponse();

        response.setPaymentReference(
                request.getPaymentReference());

        response.setPaymentMode(
                request.getPaymentMode());

        // IMPS account number validation
        if (request.getAccountNumber() == null ||
                request.getAccountNumber().isBlank() ||
                !request.getAccountNumber()
                        .matches("\\d{9,18}")) {

            response.setStatus(PaymentStatus.FAILED);

            response.setMessage(
                    "IMPS payment processing failed");

            return response;
        }

        // IMPS processing
        response.setStatus(PaymentStatus.SUCCESS);

        response.setMessage(
                "IMPS payment processed successfully");

        return response;
    }
}