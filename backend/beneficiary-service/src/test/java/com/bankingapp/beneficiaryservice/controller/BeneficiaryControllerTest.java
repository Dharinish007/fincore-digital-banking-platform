package com.bankingapp.beneficiaryservice.controller;

import com.bankingapp.beneficiaryservice.dto.BeneficiaryRequest;
import com.bankingapp.beneficiaryservice.dto.BeneficiaryResponse;
import com.bankingapp.beneficiaryservice.enums.BeneficiaryStatus;
import com.bankingapp.beneficiaryservice.exception.BeneficiaryNotFoundException;
import com.bankingapp.beneficiaryservice.service.BeneficiaryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BeneficiaryController.class)
class BeneficiaryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BeneficiaryService beneficiaryService;

    @Test
    void createBeneficiary_Returns201() throws Exception {
        BeneficiaryRequest request = new BeneficiaryRequest();
        request.setCustomerId(101L);
        request.setBeneficiaryName("Alice Smith");
        request.setAccountNumber("987654321012");
        request.setIfscCode("SBIN0001234");
        request.setBankName("State Bank of India");

        BeneficiaryResponse response = new BeneficiaryResponse();
        response.setBeneficiaryId(1L);
        response.setCustomerId(101L);
        response.setBeneficiaryName("Alice Smith");
        response.setStatus(BeneficiaryStatus.ACTIVE);

        when(beneficiaryService.createBeneficiary(any(BeneficiaryRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/beneficiaries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.beneficiaryId").value(1))
                .andExpect(jsonPath("$.beneficiaryName").value("Alice Smith"));
    }

    @Test
    void getBeneficiaryById_Returns200() throws Exception {
        BeneficiaryResponse response = new BeneficiaryResponse();
        response.setBeneficiaryId(1L);
        response.setBeneficiaryName("Alice Smith");

        when(beneficiaryService.getBeneficiaryById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/beneficiaries/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.beneficiaryId").value(1));
    }

    @Test
    void getBeneficiaryById_NotFound_Returns404() throws Exception {
        when(beneficiaryService.getBeneficiaryById(999L)).thenThrow(new BeneficiaryNotFoundException("Beneficiary not found with ID: 999"));

        mockMvc.perform(get("/api/v1/beneficiaries/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void getBeneficiariesByCustomer_Returns200() throws Exception {
        BeneficiaryResponse response = new BeneficiaryResponse();
        response.setBeneficiaryId(1L);

        when(beneficiaryService.getBeneficiariesByCustomer(101L)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/v1/beneficiaries/customer/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }
}
