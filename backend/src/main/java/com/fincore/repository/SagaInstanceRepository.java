package com.fincore.repository;

import com.fincore.entity.SagaInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface SagaInstanceRepository extends JpaRepository<SagaInstance, String> {
    Optional<SagaInstance> findBySagaId(String sagaId);
    List<SagaInstance> findBySagaType(String sagaType);
    List<SagaInstance> findByStatus(SagaInstance.SagaStatus status);
}
