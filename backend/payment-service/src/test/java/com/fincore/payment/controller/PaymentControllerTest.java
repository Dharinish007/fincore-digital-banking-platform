package com.fincore.payment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fincore.payment.dto.PaymentRequest;
import com.fincore.payment.dto.PaymentResponse;
import com.fincore.payment.enums.PaymentMode;
import com.fincore.payment.enums.PaymentStatus;
import com.fincore.payment.exception.PaymentNotFoundException;
import com.fincore.payment.service.PaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    @Test
    void initiatePayment_Returns201() throws Exception {
        PaymentRequest request = new PaymentRequest();
        request.setCustomerId(101L);
        request.setBeneficiaryId(501L);
        request.setAmount(new BigDecimal("100.00"));
        request.setPaymentMode(PaymentMode.IMPS);
        request.setRemarks("Test payment");

        PaymentResponse response = new PaymentResponse();
        response.setId(1L);
        response.setPaymentReference("PAY-ABC12345");
        response.setStatus(PaymentStatus.SUCCESS);

        when(paymentService.initiatePayment(any(PaymentRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/payments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.paymentReference").value("PAY-ABC12345"))
                .andExpect(jsonPath("$.status").value("SUCCESS"));
    }

    @Test
    void getPayment_Returns200() throws Exception {
        PaymentResponse response = new PaymentResponse();
        response.setId(1L);
        response.setPaymentReference("PAY-ABC12345");
        response.setStatus(PaymentStatus.SUCCESS);

        when(paymentService.getPayment(1L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/payments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.paymentReference").value("PAY-ABC12345"));
    }

    @Test
    void getPayment_NotFound_Returns404() throws Exception {
        when(paymentService.getPayment(999L)).thenThrow(new PaymentNotFoundException("Payment not found with ID: 999"));

        mockMvc.perform(get("/api/v1/payments/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    @Test
    void getPaymentsByCustomer_Returns200() throws Exception {
        PaymentResponse response = new PaymentResponse();
        response.setId(1L);
        response.setCustomerId(101L);

        when(paymentService.getPaymentsByCustomerId(101L)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/v1/payments/customer/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }
}
