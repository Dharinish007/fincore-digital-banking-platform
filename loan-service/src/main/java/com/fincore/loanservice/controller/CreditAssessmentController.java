package com.fincore.loanservice.controller;

import com.fincore.loanservice.dto.CreditAssessmentRequest;
import com.fincore.loanservice.dto.CreditAssessmentResult;
import com.fincore.loanservice.service.CreditAssessmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/credit")
public class CreditAssessmentController {

  private final CreditAssessmentService creditAssessmentService;

  public CreditAssessmentController(CreditAssessmentService creditAssessmentService) {
    this.creditAssessmentService = creditAssessmentService;
  }

  @PostMapping("/assess")
  public ResponseEntity<CreditAssessmentResult> assess(@Valid @RequestBody CreditAssessmentRequest request) {
    return ResponseEntity.ok(creditAssessmentService.assess(request));
  }
}
