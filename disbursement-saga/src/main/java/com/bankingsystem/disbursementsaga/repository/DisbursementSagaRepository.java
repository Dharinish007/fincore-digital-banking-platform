package com.bankingsystem.disbursementsaga.repository;

import com.bankingsystem.disbursementsaga.entity.DisbursementSagaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DisbursementSagaRepository extends JpaRepository<DisbursementSagaEntity, Long> {
    Optional<DisbursementSagaEntity> findBySagaId(String sagaId);
}
