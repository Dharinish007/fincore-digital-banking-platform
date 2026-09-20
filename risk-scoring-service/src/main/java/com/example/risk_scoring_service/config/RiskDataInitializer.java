package com.example.risk_scoring_service.config;

import com.example.risk_scoring_service.dto.RiskAssessmentRequestDTO;
import com.example.risk_scoring_service.dto.RiskFactorDTO;
import com.example.risk_scoring_service.repository.RiskAssessmentRepository;
import com.example.risk_scoring_service.service.RiskAssessmentService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class RiskDataInitializer implements CommandLineRunner {

    private final RiskAssessmentRepository repository;
    private final RiskAssessmentService service;

    public RiskDataInitializer(RiskAssessmentRepository repository, RiskAssessmentService service) {
        this.repository = repository;
        this.service = service;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            RiskAssessmentRequestDTO req1 = new RiskAssessmentRequestDTO();
            req1.setCustomerId(1001L);
            req1.setCustomerName("Aarav Sharma");
            req1.setAccountNumber("ACC-1001-SAVINGS");
            req1.setTransactionId("TXN-90001");
            req1.setTransactionAmount(new BigDecimal("25000.00"));
            List<RiskFactorDTO> factors1 = new ArrayList<>();
            RiskFactorDTO f1 = new RiskFactorDTO();
            f1.setFactor("TRANSACTION_VELOCITY");
            f1.setDescription("Normal transaction velocity within standard tier");
            factors1.add(f1);
            req1.setRiskFactors(factors1);
            service.createRiskAssessment(req1);

            RiskAssessmentRequestDTO req2 = new RiskAssessmentRequestDTO();
            req2.setCustomerId(1002L);
            req2.setCustomerName("Priya Patel");
            req2.setAccountNumber("ACC-2002-CURRENT");
            req2.setTransactionId("TXN-90002");
            req2.setTransactionAmount(new BigDecimal("150000.00"));
            List<RiskFactorDTO> factors2 = new ArrayList<>();
            RiskFactorDTO f2 = new RiskFactorDTO();
            f2.setFactor("LARGE_AMOUNT");
            f2.setDescription("High value cross-border transfer flagged for enhanced review");
            factors2.add(f2);
            req2.setRiskFactors(factors2);
            service.createRiskAssessment(req2);
        }
    }
}
