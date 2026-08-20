package com.fincore.loan.controller;

import com.fincore.loan.dto.*;
import com.fincore.loan.enums.ApplicationStatus;
import com.fincore.loan.service.LoanApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/loan-applications")
@RequiredArgsConstructor
@Validated
public class LoanApplicationController {

    private final LoanApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApiResponse<LoanApplicationResponse>> submitApplication(
            @Valid @RequestBody LoanApplicationRequest request) {
        LoanApplicationResponse response = applicationService.submitApplication(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Loan application submitted successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanApplicationResponse>> getApplicationById(@PathVariable Long id) {
        LoanApplicationResponse response = applicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan application retrieved successfully"));
    }

    @GetMapping("/number/{applicationNumber}")
    public ResponseEntity<ApiResponse<LoanApplicationResponse>> getApplicationByNumber(
            @PathVariable String applicationNumber) {
        LoanApplicationResponse response = applicationService.getApplicationByNumber(applicationNumber);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan application retrieved successfully"));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<Page<LoanApplicationResponse>>> getApplicationsByCustomerId(
            @PathVariable Long customerId,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        Page<LoanApplicationResponse> response = applicationService.getApplicationsByCustomerId(customerId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, "Customer loan applications retrieved successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<LoanApplicationResponse>>> getAllApplications(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) ApplicationStatus status,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        Page<LoanApplicationResponse> response = applicationService.getAllApplications(customerId, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan applications retrieved successfully"));
    }

    @PostMapping("/{id}/credit-assessment")
    public ResponseEntity<ApiResponse<CreditAssessmentResponse>> assessApplication(@PathVariable Long id) {
        CreditAssessmentResponse response = applicationService.assessApplication(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Credit assessment completed successfully"));
    }

    @GetMapping("/{id}/credit-assessment")
    public ResponseEntity<ApiResponse<CreditAssessmentResponse>> getCreditAssessment(@PathVariable Long id) {
        CreditAssessmentResponse response = applicationService.getCreditAssessment(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Credit assessment retrieved successfully"));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<LoanResponse>> approveApplication(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalRequest request) {
        LoanResponse response = applicationService.approveApplication(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan application approved and loan generated successfully"));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<LoanApplicationResponse>> rejectApplication(
            @PathVariable Long id,
            @Valid @RequestBody RejectionRequest request) {
        LoanApplicationResponse response = applicationService.rejectApplication(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan application rejected"));
    }
}
