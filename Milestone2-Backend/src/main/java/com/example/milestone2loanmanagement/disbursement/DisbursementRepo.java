package com.example.milestone2loanmanagement.disbursement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisbursementRepo extends JpaRepository<DisbursementEntity,Long> {
    List<DisbursementEntity> findByLoanId(Long loanId);
}
