package com.fincore.payment.service;

import com.fincore.payment.client.BeneficiaryClient;
import com.fincore.payment.client.PaymentModeClient;
import com.fincore.payment.client.dto.BeneficiaryClientResponse;
import com.fincore.payment.client.dto.PaymentModeClientRequest;
import com.fincore.payment.client.dto.PaymentModeClientResponse;
import com.fincore.payment.dto.PaymentRequest;
import com.fincore.payment.dto.PaymentResponse;
import com.fincore.payment.entity.Payment;
import com.fincore.payment.enums.PaymentMode;
import com.fincore.payment.enums.PaymentStatus;
import com.fincore.payment.exception.PaymentNotFoundException;
import com.fincore.payment.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private BeneficiaryClient beneficiaryClient;

    @Mock
    private PaymentModeClient paymentModeClient;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private PaymentRequest validRequest;
    private BeneficiaryClientResponse activeBeneficiary;

    @BeforeEach
    void setUp() {
        validRequest = new PaymentRequest();
        validRequest.setCustomerId(101L);
        validRequest.setBeneficiaryId(501L);
        validRequest.setAmount(new BigDecimal("1500.00"));
        validRequest.setPaymentMode(PaymentMode.IMPS);
        validRequest.setRemarks("Monthly rent");

        activeBeneficiary = new BeneficiaryClientResponse();
        activeBeneficiary.setBeneficiaryId(501L);
        activeBeneficiary.setCustomerId(101L);
        activeBeneficiary.setBeneficiaryName("Jane Doe");
        activeBeneficiary.setAccountNumber("123456789012");
        activeBeneficiary.setIfscCode("HDFC0001234");
        activeBeneficiary.setStatus("ACTIVE");
    }

    @Test
    void initiatePayment_Success_WithModeClient() {
        when(beneficiaryClient.getBeneficiaryById(501L)).thenReturn(Optional.of(activeBeneficiary));

        PaymentModeClientResponse modeResponse = new PaymentModeClientResponse();
        modeResponse.setStatus("SUCCESS");
        modeResponse.setMessage("IMPS processed successfully");
        when(paymentModeClient.processPaymentMode(any(PaymentModeClientRequest.class))).thenReturn(Optional.of(modeResponse));

        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment p = invocation.getArgument(0);
            p.setId(1L);
            return p;
        });

        PaymentResponse response = paymentService.initiatePayment(validRequest);

        assertNotNull(response);
        assertEquals(PaymentStatus.SUCCESS, response.getStatus());
        assertEquals("IMPS processed successfully", response.getRemarks());
        assertNotNull(response.getPaymentReference());
        assertTrue(response.getPaymentReference().startsWith("PAY-"));
    }

    @Test
    void initiatePayment_Success_FallbackWhenOffline() {
        when(beneficiaryClient.getBeneficiaryById(501L)).thenReturn(Optional.empty());
        when(paymentModeClient.processPaymentMode(any(PaymentModeClientRequest.class))).thenReturn(Optional.empty());

        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment p = invocation.getArgument(0);
            p.setId(2L);
            return p;
        });

        PaymentResponse response = paymentService.initiatePayment(validRequest);

        assertNotNull(response);
        assertEquals(PaymentStatus.SUCCESS, response.getStatus());
        assertTrue(response.getRemarks().contains("IMPS"));
    }

    @Test
    void initiatePayment_Fails_WhenBeneficiaryCustomerMismatch() {
        BeneficiaryClientResponse mismatchedBeneficiary = new BeneficiaryClientResponse();
        mismatchedBeneficiary.setBeneficiaryId(501L);
        mismatchedBeneficiary.setCustomerId(999L); // different customer
        mismatchedBeneficiary.setStatus("ACTIVE");

        when(beneficiaryClient.getBeneficiaryById(501L)).thenReturn(Optional.of(mismatchedBeneficiary));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PaymentResponse response = paymentService.initiatePayment(validRequest);

        assertEquals(PaymentStatus.FAILED, response.getStatus());
        assertTrue(response.getRemarks().contains("does not belong to customer"));
    }

    @Test
    void initiatePayment_Fails_WhenBeneficiaryInactive() {
        activeBeneficiary.setStatus("INACTIVE");
        when(beneficiaryClient.getBeneficiaryById(501L)).thenReturn(Optional.of(activeBeneficiary));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PaymentResponse response = paymentService.initiatePayment(validRequest);

        assertEquals(PaymentStatus.FAILED, response.getStatus());
        assertEquals("Beneficiary is inactive", response.getRemarks());
    }

    @Test
    void initiatePayment_Fails_WhenValidationFails() {
        validRequest.setAmount(new BigDecimal("-10.00"));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PaymentResponse response = paymentService.initiatePayment(validRequest);

        assertEquals(PaymentStatus.FAILED, response.getStatus());
        assertTrue(response.getRemarks().contains("Validation failed"));
    }

    @Test
    void initiatePayment_Fails_WhenFraudFlagged() {
        validRequest.setAmount(new BigDecimal("15000000.00")); // > 10M limit
        when(beneficiaryClient.getBeneficiaryById(501L)).thenReturn(Optional.of(activeBeneficiary));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PaymentResponse response = paymentService.initiatePayment(validRequest);

        assertEquals(PaymentStatus.FAILED, response.getStatus());
        assertTrue(response.getRemarks().contains("fraud"));
    }

    @Test
    void getPayment_Success() {
        Payment payment = new Payment();
        payment.setId(10L);
        payment.setPaymentReference("PAY-12345678");
        payment.setCustomerId(101L);
        payment.setBeneficiaryId(501L);
        payment.setAmount(new BigDecimal("500.00"));
        payment.setPaymentMode(PaymentMode.UPI);
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        when(paymentRepository.findById(10L)).thenReturn(Optional.of(payment));

        PaymentResponse response = paymentService.getPayment(10L);
        assertEquals(10L, response.getId());
        assertEquals("PAY-12345678", response.getPaymentReference());
        assertEquals(PaymentStatus.SUCCESS, response.getStatus());
    }

    @Test
    void getPayment_NotFound_ThrowsException() {
        when(paymentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(PaymentNotFoundException.class, () -> paymentService.getPayment(99L));
    }

    @Test
    void getPaymentByReference_Success() {
        Payment payment = new Payment();
        payment.setId(10L);
        payment.setPaymentReference("PAY-REF123");
        payment.setStatus(PaymentStatus.SUCCESS);

        when(paymentRepository.findByPaymentReference("PAY-REF123")).thenReturn(Optional.of(payment));

        PaymentResponse response = paymentService.getPaymentByReference("PAY-REF123");
        assertEquals("PAY-REF123", response.getPaymentReference());
    }

    @Test
    void getPaymentsByCustomerId_ReturnsList() {
        Payment p1 = new Payment();
        p1.setId(1L);
        p1.setCustomerId(101L);
        p1.setStatus(PaymentStatus.SUCCESS);

        when(paymentRepository.findByCustomerId(101L)).thenReturn(List.of(p1));

        List<PaymentResponse> results = paymentService.getPaymentsByCustomerId(101L);
        assertEquals(1, results.size());
        assertEquals(1L, results.get(0).getId());
    }
}
