package com.fincore.settlement_confirmation_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fincore.settlement_confirmation_service.entity.Settlement;
import com.fincore.settlement_confirmation_service.enums.SettlementStatus;

public interface SettlementRepository
        extends JpaRepository<Settlement, Long> {

    List<Settlement> findByStatus(SettlementStatus status);

    List<Settlement> findBySettlementIdContainingIgnoreCaseOrTransactionReferenceContainingIgnoreCaseOrCustomerNameContainingIgnoreCase(
            String settlementId,
            String transactionReference,
            String customerName);
}