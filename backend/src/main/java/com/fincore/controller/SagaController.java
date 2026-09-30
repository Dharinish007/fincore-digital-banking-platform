package com.fincore.controller;

import com.fincore.dto.ApiResponse;
import com.fincore.entity.SagaInstance;
import com.fincore.service.SagaOrchestratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/milestone3/saga")
@CrossOrigin(origins = "*")
public class SagaController {

    @Autowired
    private SagaOrchestratorService sagaOrchestratorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SagaInstance>>> getAllSagas() {
        return ResponseEntity.ok(ApiResponse.ok("Saga executions retrieved", sagaOrchestratorService.getAllSagas()));
    }

    @PostMapping("/disbursement")
    public ResponseEntity<ApiResponse<SagaInstance>> triggerDisbursementSaga(@RequestBody Map<String, Object> body) {
        String loanId = (String) body.get("loanId");
        String accountId = (String) body.get("accountId");
        Double amount = body.get("amount") != null ? Double.valueOf(body.get("amount").toString()) : 0.0;

        SagaInstance instance = sagaOrchestratorService.executeDisbursementSaga(loanId, accountId, amount);
        return ResponseEntity.ok(ApiResponse.ok("Disbursement Saga executed successfully", instance));
    }
}
