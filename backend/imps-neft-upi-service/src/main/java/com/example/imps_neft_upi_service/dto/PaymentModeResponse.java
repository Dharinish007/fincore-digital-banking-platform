package com.example.imps_neft_upi_service.dto;

import com.example.imps_neft_upi_service.enums.PaymentMode;
import com.example.imps_neft_upi_service.enums.PaymentStatus;

public class PaymentModeResponse {

    private String paymentReference;
    private PaymentMode paymentMode;
    private PaymentStatus status;
    private String message;

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public PaymentMode getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(PaymentMode paymentMode) {
        this.paymentMode = paymentMode;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}