package com.bankingsystem.complianceservice.controller;

import com.bankingsystem.complianceservice.dto.ComplianceCheckRequest;
import com.bankingsystem.complianceservice.dto.ComplianceCheckResponse;
import com.bankingsystem.complianceservice.service.ComplianceCheckService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compliance")
public class ComplianceController {
    private final ComplianceCheckService service;

    public ComplianceController(ComplianceCheckService service) {
        this.service = service;
    }

    @PostMapping("/check")
    public ResponseEntity<ComplianceCheckResponse> check(@Valid @RequestBody ComplianceCheckRequest request) {
        return ResponseEntity.ok(service.check(request));
    }
}
