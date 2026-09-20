package com.example.milestone3.fraudDetection;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FraudEventRepo extends JpaRepository<FraudEvent, Long> {
    List<FraudEvent> findTop10ByOrderByIdDesc();
    List<FraudEvent> findAllByOrderByIdDesc();
    Optional<FraudEvent> findByTransactionId(Long transactionId);
}
