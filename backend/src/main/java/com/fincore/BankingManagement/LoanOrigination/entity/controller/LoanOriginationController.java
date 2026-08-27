package com.fincore.BankingManagement.LoanOrigination.entity.controller;

import com.fincore.BankingManagement.LoanOrigination.entity.ApplicationStatus;
import com.fincore.BankingManagement.LoanOrigination.entity.LoanOrigination;
import com.fincore.BankingManagement.LoanOrigination.entity.dto.LoanApplicationRequest;
import com.fincore.BankingManagement.LoanOrigination.entity.dto.LoanApplicationResponse;
import com.fincore.BankingManagement.LoanOrigination.entity.service.LoanOriginationService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loan-origination")
@CrossOrigin("*")
@RequiredArgsConstructor
public class LoanOriginationController {

        private final LoanOriginationService service;

        // =====================================================
        // CREATE LOAN APPLICATION
        // =====================================================
        @PostMapping
        public ResponseEntity<LoanApplicationResponse> createLoanApplication(
                        @RequestBody LoanApplicationRequest request) {
                try {
                        LoanOrigination loan = service.createLoanApplication(request);
                        LoanApplicationResponse response = service.convertToResponse(loan);
                        return ResponseEntity
                                        .status(HttpStatus.CREATED)
                                        .body(response);
                } catch (IllegalArgumentException e) {
                        return ResponseEntity
                                        .status(HttpStatus.BAD_REQUEST)
                                        .build();
                } catch (Exception e) {
                        return ResponseEntity
                                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .build();
                }
        }

        // =====================================================
        // GET ALL LOAN APPLICATIONS
        // =====================================================
        @GetMapping
        public ResponseEntity<List<LoanApplicationResponse>> getAllLoanApplications() {
                try {
                        List<LoanOrigination> loans = service.getAllLoanApplications();
                        List<LoanApplicationResponse> responses = service.convertToResponseList(loans);
                        return ResponseEntity.ok(responses);
                } catch (Exception e) {
                        return ResponseEntity
                                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .build();
                }
        }

        // =====================================================
        // GET LOAN APPLICATION BY ID
        // =====================================================
        @GetMapping("/{loanId}")
        public ResponseEntity<LoanApplicationResponse> getLoanApplicationById(
                        @PathVariable Long loanId) {
                try {
                        LoanOrigination loan = service.getLoanApplicationById(loanId);
                        LoanApplicationResponse response = service.convertToResponse(loan);
                        return ResponseEntity.ok(response);
                } catch (RuntimeException e) {
                        return ResponseEntity
                                        .status(HttpStatus.NOT_FOUND)
                                        .build();
                } catch (Exception e) {
                        return ResponseEntity
                                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .build();
                }
        }

        // =====================================================
        // GET LOANS BY CUSTOMER ID
        // =====================================================
        @GetMapping("/customer/{customerId}")
        public ResponseEntity<List<LoanApplicationResponse>> getLoansByCustomerId(
                        @PathVariable Long customerId) {
                try {
                        List<LoanOrigination> loans = service.getLoansByCustomerId(customerId);
                        List<LoanApplicationResponse> responses = service.convertToResponseList(loans);
                        return ResponseEntity.ok(responses);
                } catch (Exception e) {
                        return ResponseEntity
                                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .build();
                }
        }

        // =====================================================
        // GET LOANS BY STATUS
        // =====================================================
        @GetMapping("/status/{status}")
        public ResponseEntity<List<LoanApplicationResponse>> getLoansByStatus(
                        @PathVariable ApplicationStatus status) {
                try {
                        List<LoanOrigination> loans = service.getLoansByStatus(status);
                        List<LoanApplicationResponse> responses = service.convertToResponseList(loans);
                        return ResponseEntity.ok(responses);
                } catch (Exception e) {
                        return ResponseEntity
                                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .build();
                }
        }

        // =====================================================
        // UPDATE LOAN STATUS
        // =====================================================
        @PutMapping("/{loanId}/status")
        public ResponseEntity<LoanApplicationResponse> updateLoanStatus(
                        @PathVariable Long loanId,
                        @RequestParam ApplicationStatus status) {
                try {
                        LoanOrigination loan = service.updateLoanStatus(loanId, status);
                        LoanApplicationResponse response = service.convertToResponse(loan);
                        return ResponseEntity.ok(response);
                } catch (RuntimeException e) {
                        return ResponseEntity
                                        .status(HttpStatus.NOT_FOUND)
                                        .build();
                } catch (Exception e) {
                        return ResponseEntity
                                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .build();
                }
        }
}