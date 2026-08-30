package com.bankingsystem.disbursementsaga.controller;

import com.bankingsystem.disbursementsaga.dto.DisbursementRequest;
import com.bankingsystem.disbursementsaga.dto.DisbursementResponse;
import com.bankingsystem.disbursementsaga.entity.DisbursementSagaEntity;
import com.bankingsystem.disbursementsaga.repository.DisbursementSagaRepository;
import com.bankingsystem.disbursementsaga.service.DisbursementSagaOrchestrator;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/disbursements")
public class DisbursementController {

    private final DisbursementSagaOrchestrator orchestrator;
    private final DisbursementSagaRepository sagaRepository;

    public DisbursementController(DisbursementSagaOrchestrator orchestrator,
                                  DisbursementSagaRepository sagaRepository) {
        this.orchestrator = orchestrator;
        this.sagaRepository = sagaRepository;
    }

    @PostMapping
    public ResponseEntity<DisbursementResponse> disburse(@Valid @RequestBody DisbursementRequest request) {
        DisbursementResponse response = orchestrator.run(request);
        HttpStatus status = response.getStatus().name().equals("COMPLETED")
                ? HttpStatus.OK
                : HttpStatus.UNPROCESSABLE_ENTITY;
        return ResponseEntity.status(status).body(response);
    }

    @GetMapping("/{sagaId}")
    public ResponseEntity<DisbursementSagaEntity> getSaga(@PathVariable String sagaId) {
        return sagaRepository.findBySagaId(sagaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
