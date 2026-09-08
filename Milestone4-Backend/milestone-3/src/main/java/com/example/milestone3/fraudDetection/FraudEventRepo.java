package com.example.milestone3.fraudDetection;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FraudEventRepo extends JpaRepository<FraudEvent,Long> {
}
