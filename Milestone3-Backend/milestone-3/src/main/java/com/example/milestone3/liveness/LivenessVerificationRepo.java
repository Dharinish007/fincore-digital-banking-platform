package com.example.milestone3.liveness;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LivenessVerificationRepo extends JpaRepository<LivenessVerification, Long> {
    List<LivenessVerification> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
