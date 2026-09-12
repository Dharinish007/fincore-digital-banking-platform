package com.example.securedigitalbankingmilestone4.livenessDetection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivenessDetectionRepo extends JpaRepository<LivenessVerification, Long> {

    List<LivenessVerification> findByUserId(Long userId);
}