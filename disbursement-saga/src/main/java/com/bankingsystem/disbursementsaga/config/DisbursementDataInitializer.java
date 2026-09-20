package com.bankingsystem.disbursementsaga.config;

import com.bankingsystem.disbursementsaga.dto.DisbursementRequest;
import com.bankingsystem.disbursementsaga.repository.DisbursementSagaRepository;
import com.bankingsystem.disbursementsaga.service.DisbursementSagaOrchestrator;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DisbursementDataInitializer implements CommandLineRunner {

    private final DisbursementSagaRepository repository;
    private final DisbursementSagaOrchestrator orchestrator;

    public DisbursementDataInitializer(DisbursementSagaRepository repository, DisbursementSagaOrchestrator orchestrator) {
        this.repository = repository;
        this.orchestrator = orchestrator;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            DisbursementRequest req = new DisbursementRequest();
            req.setKycId(101L);
            req.setSourceAccount("1234-5678-9012");
            req.setTargetAccount("2231-9087-4410");
            req.setAmount(new BigDecimal("5000.00"));
            req.setPerformedBy("OFFICER-SAGA");
            orchestrator.run(req);
        }
    }
}
