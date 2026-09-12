package com.example.imps_neft_upi_service.controller;

import com.example.imps_neft_upi_service.dto.PaymentModeRequest;
import com.example.imps_neft_upi_service.dto.PaymentModeResponse;
import com.example.imps_neft_upi_service.enums.PaymentMode;
import com.example.imps_neft_upi_service.enums.PaymentStatus;
import com.example.imps_neft_upi_service.service.PaymentModeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentModeController.class)
class PaymentModeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentModeService paymentModeService;

    @Test
    void processPayment_Returns200() throws Exception {
        PaymentModeRequest request = new PaymentModeRequest();
        request.setPaymentReference("PAY-12345");
        request.setPaymentMode(PaymentMode.IMPS);
        request.setAmount(new BigDecimal("100.00"));
        request.setCustomerId(101L);
        request.setBeneficiaryId(501L);
        request.setAccountNumber("123456789012");

        PaymentModeResponse response = new PaymentModeResponse();
        response.setPaymentReference("PAY-12345");
        response.setPaymentMode(PaymentMode.IMPS);
        response.setStatus(PaymentStatus.SUCCESS);
        response.setMessage("IMPS payment processed successfully");

        when(paymentModeService.processPayment(any(PaymentModeRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/payment-modes/process")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentReference").value("PAY-12345"))
                .andExpect(jsonPath("$.status").value("SUCCESS"));
    }
}
