package com.fincore.controller;

import com.fincore.dto.ApiResponse;
import com.fincore.dto.LoanApplyRequest;
import com.fincore.dto.RepaymentRequest;
import com.fincore.entity.Loan;
import com.fincore.entity.RepaymentSchedule;
import com.fincore.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "*")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Loan>>> getAllLoans() {
        return ResponseEntity.ok(ApiResponse.ok("Loans retrieved", loanService.getAllLoans()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Loan>> getLoanById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Loan retrieved", loanService.getLoanById(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}/schedules")
    public ResponseEntity<ApiResponse<List<RepaymentSchedule>>> getSchedules(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok("Amortization schedules retrieved", loanService.getRepaymentSchedules(id)));
    }

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<Loan>> apply(@Valid @RequestBody LoanApplyRequest request) {
        try {
            Loan loan = loanService.applyLoan(request);
            return ResponseEntity.ok(ApiResponse.ok("Loan application submitted", loan));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<Loan>> approve(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        try {
            String approvedBy = body != null ? body.getOrDefault("approvedBy", "SUPERVISOR") : "SUPERVISOR";
            Loan loan = loanService.approveLoan(id, approvedBy);
            return ResponseEntity.ok(ApiResponse.ok("Loan approved by credit committee", loan));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/disburse")
    public ResponseEntity<ApiResponse<Loan>> disburse(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        try {
            String performedBy = body != null ? body.getOrDefault("performedBy", "SUPERVISOR") : "SUPERVISOR";
            Loan loan = loanService.disburseLoan(id, performedBy);
            return ResponseEntity.ok(ApiResponse.ok("Loan disbursed and credited to account", loan));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/repay")
    public ResponseEntity<ApiResponse<RepaymentSchedule>> repay(@Valid @RequestBody RepaymentRequest request) {
        try {
            RepaymentSchedule schedule = loanService.payEmi(request);
            return ResponseEntity.ok(ApiResponse.ok("EMI repayment processed successfully", schedule));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
