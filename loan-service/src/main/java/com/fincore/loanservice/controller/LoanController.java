package com.fincore.loanservice.controller;

import com.fincore.loanservice.dto.LoanRequest;
import com.fincore.loanservice.dto.LoanResponse;
import com.fincore.loanservice.enums.LoanStatus;
import com.fincore.loanservice.service.LoanService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

  private final LoanService loanService;

  public LoanController(LoanService loanService) {
    this.loanService = loanService;
  }

  // Create a new loan
  @PostMapping
  public ResponseEntity<LoanResponse> createLoan(
    @Valid @RequestBody LoanRequest request) {

    LoanResponse response =
      loanService.createLoan(request);

    return new ResponseEntity<>(
      response,
      HttpStatus.CREATED
    );
  }

  // Get loan by ID
  @GetMapping("/{id}")
  public ResponseEntity<LoanResponse> getLoanById(
    @PathVariable Long id) {

    return ResponseEntity.ok(
      loanService.getLoanById(id)
    );
  }

  // Get loan by loan number
  @GetMapping("/number/{loanNumber}")
  public ResponseEntity<LoanResponse> getLoanByNumber(
    @PathVariable String loanNumber) {

    return ResponseEntity.ok(
      loanService.getLoanByNumber(loanNumber)
    );
  }

  // Get all loans of a customer
  @GetMapping("/customer/{customerId}")
  public ResponseEntity<List<LoanResponse>> getLoansByCustomer(
    @PathVariable Long customerId) {

    return ResponseEntity.ok(
      loanService.getLoansByCustomer(customerId)
    );
  }

  // Update loan status
  @PatchMapping("/{id}/status")
  public ResponseEntity<LoanResponse> updateStatus(
    @PathVariable Long id,
    @RequestParam LoanStatus status) {

    return ResponseEntity.ok(
      loanService.updateStatus(id, status)
    );
  }
}
