package com.fincore.BankingManagement.LoanOrigination.controller;

import com.fincore.BankingManagement.LoanOrigination.entity.LoanOrigination;
import com.fincore.BankingManagement.LoanOrigination.service.LoanOriginationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loan-origination")
@CrossOrigin(origins = "*")
public class LoanOriginationController {

    private final LoanOriginationService loanOriginationService;

    public LoanOriginationController(
            LoanOriginationService loanOriginationService) {
        this.loanOriginationService = loanOriginationService;
    }

    @PostMapping
    public ResponseEntity<LoanOrigination> createLoanApplication(
            @RequestBody LoanOrigination loanOrigination) {

        LoanOrigination createdLoan =
                loanOriginationService.createLoanApplication(loanOrigination);

        return new ResponseEntity<>(createdLoan, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LoanOrigination>> getAllLoanApplications() {

        return ResponseEntity.ok(
                loanOriginationService.getAllLoanApplications()
        );
    }

    @GetMapping("/{loanId}")
    public ResponseEntity<LoanOrigination> getLoanApplicationById(
            @PathVariable Long loanId) {

        return ResponseEntity.ok(
                loanOriginationService.getLoanApplicationById(loanId)
        );
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<LoanOrigination>> getLoansByCustomerId(
            @PathVariable Long customerId) {

        return ResponseEntity.ok(
                loanOriginationService.getLoansByCustomerId(customerId)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<LoanOrigination>> getLoansByStatus(
            @PathVariable LoanOrigination.ApplicationStatus status) {

        return ResponseEntity.ok(
                loanOriginationService.getLoansByStatus(status)
        );
    }

    @PutMapping("/{loanId}/status")
    public ResponseEntity<LoanOrigination> updateLoanStatus(
            @PathVariable Long loanId,
            @RequestParam LoanOrigination.ApplicationStatus status) {

        return ResponseEntity.ok(
                loanOriginationService.updateLoanStatus(loanId, status)
        );
    }
}