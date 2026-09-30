package com.fincore.repository;

import com.fincore.entity.NpaRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NpaRecordRepository extends JpaRepository<NpaRecord, String> {
    Optional<NpaRecord> findByLoanId(String loanId);
    List<NpaRecord> findByClassificationCategory(String classificationCategory);
}
