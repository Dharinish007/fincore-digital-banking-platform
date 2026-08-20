package com.bankingapp.beneficiaryservice.controller;

import com.bankingapp.beneficiaryservice.dto.BeneficiaryRequest;
import com.bankingapp.beneficiaryservice.dto.BeneficiaryResponse;
import com.bankingapp.beneficiaryservice.service.BeneficiaryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    public BeneficiaryController(
            BeneficiaryService beneficiaryService) {
        this.beneficiaryService = beneficiaryService;
    }

    @PostMapping
    public ResponseEntity<BeneficiaryResponse> createBeneficiary(
            @Valid @RequestBody BeneficiaryRequest request) {

        return new ResponseEntity<>(
                beneficiaryService.createBeneficiary(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<BeneficiaryResponse> getBeneficiaryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                beneficiaryService.getBeneficiaryById(id)
        );
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BeneficiaryResponse>>
    getBeneficiariesByCustomer(
            @PathVariable Long customerId) {

        return ResponseEntity.ok(
                beneficiaryService
                        .getBeneficiariesByCustomer(customerId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<BeneficiaryResponse> updateBeneficiary(
            @PathVariable Long id,
            @Valid @RequestBody BeneficiaryRequest request) {

        return ResponseEntity.ok(
                beneficiaryService
                        .updateBeneficiary(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeneficiary(
            @PathVariable Long id) {

        beneficiaryService.deleteBeneficiary(id);

        return ResponseEntity.noContent().build();
    }
}