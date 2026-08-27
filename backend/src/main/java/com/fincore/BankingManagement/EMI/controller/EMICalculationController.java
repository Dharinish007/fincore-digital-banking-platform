package com.fincore.BankingManagement.EMI.controller;

import com.fincore.BankingManagement.EMI.dto.EMICalculationRequest;
import com.fincore.BankingManagement.EMI.dto.EMICalculationResponse;
import com.fincore.BankingManagement.EMI.service.EMICalculationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emi")
public class EMICalculationController {

    private final EMICalculationService emiService;

    public EMICalculationController(
            EMICalculationService emiService) {
        this.emiService = emiService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<EMICalculationResponse> calculateEMI(
            @RequestBody EMICalculationRequest request) {

        EMICalculationResponse response =
                emiService.calculateEMI(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}