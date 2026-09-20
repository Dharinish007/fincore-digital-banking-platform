package com.bankingsystem.complianceservice.config;

import com.bankingsystem.complianceservice.dto.ComplianceCheckRequest;
import com.bankingsystem.complianceservice.repository.ComplianceCheckRepository;
import com.bankingsystem.complianceservice.service.ComplianceCheckService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ComplianceDataInitializer implements CommandLineRunner {

    private final ComplianceCheckRepository repository;
    private final ComplianceCheckService service;

    public ComplianceDataInitializer(ComplianceCheckRepository repository, ComplianceCheckService service) {
        this.repository = repository;
        this.service = service;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            ComplianceCheckRequest req1 = new ComplianceCheckRequest();
            req1.setKycId(101L);
            req1.setAmount(new BigDecimal("15000.00"));
            req1.setPerformedBy("TELLER-01");
            service.check(req1);

            ComplianceCheckRequest req2 = new ComplianceCheckRequest();
            req2.setKycId(102L);
            req2.setAmount(new BigDecimal("250000.00"));
            req2.setPerformedBy("TELLER-02");
            service.check(req2);
        }
    }
}
