package com.fincore.face_match_service.repository;

import com.fincore.face_match_service.entity.FaceMatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FaceMatchRepository extends JpaRepository<FaceMatch, Long> {

    Optional<FaceMatch> findByVerificationId(String verificationId);

    Optional<FaceMatch> findTopByCustomerIdOrderByCreatedAtDesc(Long customerId);
}