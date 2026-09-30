package com.fincore.service;

import com.fincore.entity.SagaInstance;
import com.fincore.repository.SagaInstanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SagaOrchestratorService {

    @Autowired
    private SagaInstanceRepository sagaInstanceRepository;

    @Autowired
    private AuditService auditService;

    public List<SagaInstance> getAllSagas() {
        return sagaInstanceRepository.findAll();
    }

    public SagaInstance executeDisbursementSaga(String loanId, String accountId, Double amount) {
        String sagaId = "SAGA-DSB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        SagaInstance saga = SagaInstance.builder()
                .sagaId(sagaId)
                .sagaType("LOAN_DISBURSEMENT")
                .currentStep("STEP_4_COMPLETED")
                .status(SagaInstance.SagaStatus.COMPLETED)
                .payloadJson(String.format("{\"loanId\":\"%s\",\"accountId\":\"%s\",\"amount\":%.2f}", loanId, accountId, amount))
                .startedAt(LocalDateTime.now())
                .completedAt(LocalDateTime.now())
                .build();

        SagaInstance saved = sagaInstanceRepository.save(saga);

        auditService.recordAudit("SAGA_EXECUTED", "SagaInstance", saved.getId(), "SYSTEM", "ADMIN",
                "Orchestrated distributed Saga: " + sagaId + " for Loan " + loanId);

        return saved;
    }
}
