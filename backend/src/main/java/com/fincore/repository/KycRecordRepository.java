package com.fincore.repository;

import com.fincore.entity.KycRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KycRecordRepository extends JpaRepository<KycRecord, String> {
    List<KycRecord> findByCustomerId(String customerId);
    List<KycRecord> findByVerificationStatus(KycRecord.VerificationStatus status);
}
