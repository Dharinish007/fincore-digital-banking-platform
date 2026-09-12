package com.fincore.kyc.controller;

import com.fincore.kyc.entity.KycApplication;
import com.fincore.kyc.service.KycService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(KycController.class)
class KycControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private KycService kycService;

    private KycApplication testApp;

    @BeforeEach
    void setUp() {
        testApp = new KycApplication();
        testApp.setId(1L);
        testApp.setCustomerId(101L);
        testApp.setFullName("Alice Smith");
        testApp.setApplicationNumber("KYC-12345678");
        testApp.setStatus("PENDING");
        testApp.setRiskLevel("LOW");
        testApp.setFaceMatchScore(0.0);
    }

    @Test
    @DisplayName("POST /api/v1/kyc/application - creates new KYC application")
    void testCreateApplication() throws Exception {
        when(kycService.createApplication(anyLong(), anyString())).thenReturn(testApp);

        mockMvc.perform(post("/api/v1/kyc/application")
                        .param("customerId", "101")
                        .param("fullName", "Alice Smith")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.customerId").value(101))
                .andExpect(jsonPath("$.fullName").value("Alice Smith"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    @DisplayName("GET /api/v1/kyc/{id} - returns application")
    void testGetApplication() throws Exception {
        when(kycService.getApplication(1L)).thenReturn(testApp);

        mockMvc.perform(get("/api/v1/kyc/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.applicationNumber").value("KYC-12345678"));
    }

    @Test
    @DisplayName("POST /api/v1/kyc/{id}/verify - updates verification status")
    void testVerifyKyc() throws Exception {
        testApp.setStatus("APPROVED");
        testApp.setFaceMatchScore(95.0);
        when(kycService.verifyKyc(anyLong(), anyDouble())).thenReturn(testApp);

        mockMvc.perform(post("/api/v1/kyc/1/verify")
                        .param("faceMatchScore", "95.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"))
                .andExpect(jsonPath("$.faceMatchScore").value(95.0));
    }
}
