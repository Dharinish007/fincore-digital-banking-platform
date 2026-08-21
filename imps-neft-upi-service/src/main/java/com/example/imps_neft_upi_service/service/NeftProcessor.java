package com.example.imps_neft_upi_service.service;

import com.example.imps_neft_upi_service.dto.PaymentModeRequest;
import com.example.imps_neft_upi_service.dto.PaymentModeResponse;
import com.example.imps_neft_upi_service.enums.PaymentStatus;
import org.springframework.stereotype.Service;

@Service
public class NeftProcessor implements PaymentProcessor {

    @Override
    public PaymentModeResponse process(
            PaymentModeRequest request) {

        PaymentModeResponse response =
                new PaymentModeResponse();

        response.setPaymentReference(
                request.getPaymentReference());

        response.setPaymentMode(
                request.getPaymentMode());

        // Validate account number
        if (request.getAccountNumber() == null ||
                request.getAccountNumber().isBlank() ||
                !request.getAccountNumber()
                        .matches("\\d{9,18}")) {

            response.setStatus(PaymentStatus.FAILED);

            response.setMessage(
                    "NEFT payment processing failed");

            return response;
        }

        // Validate IFSC code
        if (request.getIfscCode() == null ||
                request.getIfscCode().isBlank() ||
                !request.getIfscCode()
                        .matches("[A-Z]{4}0[A-Z0-9]{6}")) {

            response.setStatus(PaymentStatus.FAILED);

            response.setMessage(
                    "NEFT payment processing failed");

            return response;
        }

        // NEFT processing
        response.setStatus(PaymentStatus.SUCCESS);

        response.setMessage(
                "NEFT payment processed successfully");

        return response;
    }
}