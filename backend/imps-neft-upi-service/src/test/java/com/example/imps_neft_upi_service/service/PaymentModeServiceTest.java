package com.example.imps_neft_upi_service.service;

import com.example.imps_neft_upi_service.dto.PaymentModeRequest;
import com.example.imps_neft_upi_service.dto.PaymentModeResponse;
import com.example.imps_neft_upi_service.enums.PaymentMode;
import com.example.imps_neft_upi_service.enums.PaymentStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class PaymentModeServiceTest {

    private PaymentModeServiceImpl paymentModeService;

    @BeforeEach
    void setUp() {
        ImpsProcessor impsProcessor = new ImpsProcessor();
        NeftProcessor neftProcessor = new NeftProcessor();
        UpiProcessor upiProcessor = new UpiProcessor();
        PaymentProcessorFactory factory = new PaymentProcessorFactory(impsProcessor, neftProcessor, upiProcessor);
        paymentModeService = new PaymentModeServiceImpl(factory);
    }

    @Test
    void processPayment_IMPS_Success() {
        PaymentModeRequest request = new PaymentModeRequest();
        request.setPaymentReference("PAY-IMPS-001");
        request.setPaymentMode(PaymentMode.IMPS);
        request.setAccountNumber("123456789012");
        request.setAmount(new BigDecimal("100.00"));
        request.setCustomerId(101L);
        request.setBeneficiaryId(501L);

        PaymentModeResponse response = paymentModeService.processPayment(request);

        assertNotNull(response);
        assertEquals(PaymentStatus.SUCCESS, response.getStatus());
        assertEquals("PAY-IMPS-001", response.getPaymentReference());
        assertEquals(PaymentMode.IMPS, response.getPaymentMode());
        assertTrue(response.getMessage().contains("IMPS payment processed"));
    }

    @Test
    void processPayment_IMPS_InvalidAccount() {
        PaymentModeRequest request = new PaymentModeRequest();
        request.setPaymentReference("PAY-IMPS-002");
        request.setPaymentMode(PaymentMode.IMPS);
        request.setAccountNumber("123"); // invalid: too short (< 9 digits)
        request.setAmount(new BigDecimal("100.00"));
        request.setCustomerId(101L);
        request.setBeneficiaryId(501L);

        PaymentModeResponse response = paymentModeService.processPayment(request);

        assertNotNull(response);
        assertEquals(PaymentStatus.FAILED, response.getStatus());
    }

    @Test
    void processPayment_NEFT_Success() {
        PaymentModeRequest request = new PaymentModeRequest();
        request.setPaymentReference("PAY-NEFT-001");
        request.setPaymentMode(PaymentMode.NEFT);
        request.setAccountNumber("123456789012");
        request.setIfscCode("HDFC0001234");
        request.setAmount(new BigDecimal("250.00"));
        request.setCustomerId(101L);
        request.setBeneficiaryId(501L);

        PaymentModeResponse response = paymentModeService.processPayment(request);

        assertNotNull(response);
        assertEquals(PaymentStatus.SUCCESS, response.getStatus());
        assertEquals("PAY-NEFT-001", response.getPaymentReference());
        assertEquals(PaymentMode.NEFT, response.getPaymentMode());
    }

    @Test
    void processPayment_NEFT_InvalidIfsc() {
        PaymentModeRequest request = new PaymentModeRequest();
        request.setPaymentReference("PAY-NEFT-002");
        request.setPaymentMode(PaymentMode.NEFT);
        request.setAccountNumber("123456789012");
        request.setIfscCode("INVALID_IFSC");
        request.setAmount(new BigDecimal("250.00"));
        request.setCustomerId(101L);
        request.setBeneficiaryId(501L);

        PaymentModeResponse response = paymentModeService.processPayment(request);

        assertNotNull(response);
        assertEquals(PaymentStatus.FAILED, response.getStatus());
    }

    @Test
    void processPayment_UPI_Success() {
        PaymentModeRequest request = new PaymentModeRequest();
        request.setPaymentReference("PAY-UPI-001");
        request.setPaymentMode(PaymentMode.UPI);
        request.setUpiId("user@okaxis");
        request.setAmount(new BigDecimal("50.00"));
        request.setCustomerId(101L);
        request.setBeneficiaryId(501L);

        PaymentModeResponse response = paymentModeService.processPayment(request);

        assertNotNull(response);
        assertEquals(PaymentStatus.SUCCESS, response.getStatus());
        assertEquals("PAY-UPI-001", response.getPaymentReference());
        assertEquals(PaymentMode.UPI, response.getPaymentMode());
    }

    @Test
    void processPayment_UPI_InvalidUpiId() {
        PaymentModeRequest request = new PaymentModeRequest();
        request.setPaymentReference("PAY-UPI-002");
        request.setPaymentMode(PaymentMode.UPI);
        request.setUpiId("invalid_upi_no_at");
        request.setAmount(new BigDecimal("50.00"));
        request.setCustomerId(101L);
        request.setBeneficiaryId(501L);

        PaymentModeResponse response = paymentModeService.processPayment(request);

        assertNotNull(response);
        assertEquals(PaymentStatus.FAILED, response.getStatus());
    }
}
