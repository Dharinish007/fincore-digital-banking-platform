package com.fincore.loan.controller;

import com.fincore.loan.dto.*;
import com.fincore.loan.enums.LoanStatus;
import com.fincore.loan.service.EmiCalculatorService;
import com.fincore.loan.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
@Validated
public class LoanController {

    private final LoanService loanService;
    private final EmiCalculatorService emiCalculatorService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanResponse>> getLoanById(@PathVariable Long id) {
        LoanResponse response = loanService.getLoanById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan retrieved successfully"));
    }

    @GetMapping("/number/{loanNumber}")
    public ResponseEntity<ApiResponse<LoanResponse>> getLoanByNumber(@PathVariable String loanNumber) {
        LoanResponse response = loanService.getLoanByNumber(loanNumber);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan retrieved successfully"));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<Page<LoanResponse>>> getLoansByCustomerId(
            @PathVariable Long customerId,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        Page<LoanResponse> response = loanService.getLoansByCustomerId(customerId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, "Customer loans retrieved successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<LoanResponse>>> getAllLoans(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) LoanStatus status,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        Page<LoanResponse> response = loanService.getAllLoans(customerId, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, "Loans retrieved successfully"));
    }

    @GetMapping("/{id}/repayment-schedule")
    public ResponseEntity<ApiResponse<RepaymentScheduleResponse>> getRepaymentSchedule(@PathVariable Long id) {
        RepaymentScheduleResponse response = loanService.getRepaymentSchedule(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Repayment schedule retrieved successfully"));
    }

    @PostMapping("/{id}/disburse")
    public ResponseEntity<ApiResponse<LoanResponse>> disburseLoan(@PathVariable Long id) {
        LoanResponse response = loanService.disburseLoan(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan disbursed successfully to account " + response.getAccountNumber()));
    }

    @PostMapping("/calculate-emi")
    public ResponseEntity<ApiResponse<EmiCalculationResponse>> calculateEmi(
            @Valid @RequestBody EmiCalculationRequest request) {
        EmiCalculationResponse response = emiCalculatorService.previewCalculation(request);
        return ResponseEntity.ok(ApiResponse.success(response, "EMI calculated successfully"));
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<LoanStatisticsResponse>> getStatistics() {
        LoanStatisticsResponse response = loanService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success(response, "Loan statistics retrieved successfully"));
    }
}
