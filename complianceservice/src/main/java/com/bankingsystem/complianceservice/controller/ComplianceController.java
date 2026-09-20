package com.bankingsystem.complianceservice.controller;

import com.bankingsystem.complianceservice.dto.ComplianceCheckRequest;
import com.bankingsystem.complianceservice.dto.ComplianceCheckResponse;
import com.bankingsystem.complianceservice.entity.ComplianceCheck;
import com.bankingsystem.complianceservice.repository.ComplianceCheckRepository;
import com.bankingsystem.complianceservice.service.ComplianceCheckService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/compliance", "/api/compliance"})
@CrossOrigin(origins = "*")
public class ComplianceController {
    private final ComplianceCheckService service;
    private final ComplianceCheckRepository repository;

    public ComplianceController(ComplianceCheckService service, ComplianceCheckRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @PostMapping("/check")
    public ResponseEntity<ComplianceCheckResponse> check(@Valid @RequestBody ComplianceCheckRequest request) {
        return ResponseEntity.ok(service.check(request));
    }

    @GetMapping
    public ResponseEntity<List<ComplianceCheck>> getAllChecks() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplianceCheck> getCheckById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
