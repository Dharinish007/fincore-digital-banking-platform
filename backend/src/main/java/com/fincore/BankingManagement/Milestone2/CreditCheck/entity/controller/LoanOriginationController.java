package com.fincore.BankingManagement.Milestone2.CreditCheck.entity.controller;

import com.fincore.BankingManagement.Milestone2.CreditCheck.entity.ApplicationStatus;
import com.fincore.BankingManagement.Milestone2.CreditCheck.entity.LoanOrigination;
import com.fincore.BankingManagement.Milestone2.CreditCheck.entity.dto.LoanApplicationRequest;
import com.fincore.BankingManagement.Milestone2.CreditCheck.entity.dto.LoanApplicationResponse;
import com.fincore.BankingManagement.Milestone2.CreditCheck.entity.service.LoanOriginationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loan-origination")
@RequiredArgsConstructor
public class LoanOriginationController {

        private final LoanOriginationService service;

        // =====================================================
        // CREATE LOAN APPLICATION
        // POST /api/loan-origination
        // =====================================================
        @PostMapping
        public ResponseEntity<LoanApplicationResponse> createLoanApplication(
                @RequestBody LoanApplicationRequest request) {
                System.out.println("This is Loan aRequest");
                try {
                        LoanOrigination loan = service.createLoanApplication(request);

                        LoanApplicationResponse response =
                                service.convertToResponse(loan);

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
        // GET /api/loan-origination
        // =====================================================
        @GetMapping
        public ResponseEntity<List<LoanApplicationResponse>> getAllLoanApplications() {

                try {
                        List<LoanOrigination> loans =
                                service.getAllLoanApplications();

                        List<LoanApplicationResponse> responses =
                                service.convertToResponseList(loans);

                        return ResponseEntity.ok(responses);

                } catch (Exception e) {
                        return ResponseEntity
                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .build();
                }
        }

        // =====================================================
        // GET LOAN APPLICATION BY ID
        // GET /api/loan-origination/{loanId}
        // =====================================================
        @GetMapping("/{loanId}")
        public ResponseEntity<LoanApplicationResponse> getLoanApplicationById(
                @PathVariable Long loanId) {

                try {
                        LoanOrigination loan =
                                service.getLoanApplicationById(loanId);

                        LoanApplicationResponse response =
                                service.convertToResponse(loan);

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
        // GET /api/loan-origination/customer/{customerId}
        // =====================================================
        @GetMapping("/customer/{customerId}")
        public ResponseEntity<List<LoanApplicationResponse>> getLoansByCustomerId(
                @PathVariable Long customerId) {

                try {
                        List<LoanOrigination> loans =
                                service.getLoansByCustomerId(customerId);

                        List<LoanApplicationResponse> responses =
                                service.convertToResponseList(loans);

                        return ResponseEntity.ok(responses);

                } catch (Exception e) {
                        return ResponseEntity
                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .build();
                }
        }

        // =====================================================
        // GET LOANS BY STATUS
        // GET /api/loan-origination/status/{status}
        // =====================================================
        @GetMapping("/status/{status}")
        public ResponseEntity<List<LoanApplicationResponse>> getLoansByStatus(
                @PathVariable String status) {

                try {
                        ApplicationStatus applicationStatus =
                                ApplicationStatus.fromValue(status);

                        List<LoanOrigination> loans =
                                service.getLoansByStatus(applicationStatus);

                        List<LoanApplicationResponse> responses =
                                service.convertToResponseList(loans);

                        return ResponseEntity.ok(responses);

                } catch (IllegalArgumentException e) {
                        return ResponseEntity
                                .badRequest()
                                .build();

                } catch (Exception e) {
                        return ResponseEntity
                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .build();
                }
        }

        // =====================================================
        // UPDATE LOAN STATUS
        // PUT /api/loan-origination/{loanId}/status?status=Approved
        // =====================================================
        @PutMapping("/{loanId}/status")
        public ResponseEntity<LoanApplicationResponse> updateLoanStatus(
                @PathVariable Long loanId,
                @RequestParam String status) {

                try {
                        ApplicationStatus applicationStatus =
                                ApplicationStatus.fromValue(status);

                        LoanOrigination loan =
                                service.updateLoanStatus(
                                        loanId,
                                        applicationStatus
                                );

                        LoanApplicationResponse response =
                                service.convertToResponse(loan);

                        return ResponseEntity.ok(response);

                } catch (IllegalArgumentException e) {
                        return ResponseEntity
                                .badRequest()
                                .build();

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