package com.fincore.kyc.repository;

import com.fincore.kyc.entity.KycDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KycDocumentRepository
        extends JpaRepository<KycDocument, Long> {

    List<KycDocument> findByKycApplicationId(Long kycApplicationId);
}