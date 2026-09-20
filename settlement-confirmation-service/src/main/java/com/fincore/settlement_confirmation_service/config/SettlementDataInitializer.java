package com.fincore.settlement_confirmation_service.config;

import com.fincore.settlement_confirmation_service.entity.Settlement;
import com.fincore.settlement_confirmation_service.enums.SettlementStatus;
import com.fincore.settlement_confirmation_service.repository.SettlementRepository;
import com.fincore.settlement_confirmation_service.service.SettlementService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class SettlementDataInitializer implements CommandLineRunner {

    private final SettlementRepository repository;
    private final SettlementService service;

    public SettlementDataInitializer(SettlementRepository repository, SettlementService service) {
        this.repository = repository;
        this.service = service;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            Settlement s1 = new Settlement();
            s1.setSettlementId("SETTLE-2026-001");
            s1.setTransactionReference("TXN-REF-98711");
            s1.setCustomerName("Rohan Verma");
            s1.setAccountNumber("ACC-4412-8891");
            s1.setSettlementAmount(new BigDecimal("75000.00"));
            s1.setSettlementDate(LocalDate.now());
            s1.setTransactionCount(3);
            s1.setStatus(SettlementStatus.PENDING);
            service.createSettlement(s1);

            Settlement s2 = new Settlement();
            s2.setSettlementId("SETTLE-2026-002");
            s2.setTransactionReference("TXN-REF-98712");
            s2.setCustomerName("Ananya Sen");
            s2.setAccountNumber("ACC-5521-9902");
            s2.setSettlementAmount(new BigDecimal("120000.00"));
            s2.setSettlementDate(LocalDate.now().minusDays(1));
            s2.setTransactionCount(5);
            s2.setStatus(SettlementStatus.CONFIRMED);
            s2.setManagerId("MGR-OPS-01");
            s2.setConfirmedAt(java.time.LocalDateTime.now().minusHours(4));
            service.createSettlement(s2);
        }
    }
}
