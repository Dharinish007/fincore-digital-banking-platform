package com.bankingapp.originationservice.repository;

import com.bankingapp.originationservice.entity.LoanOriginationStage;
import com.bankingapp.originationservice.enums.StageName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanOriginationStageRepository
        extends JpaRepository<LoanOriginationStage, Long> {

    List<LoanOriginationStage> findByLoanId(Long loanId);

    Optional<LoanOriginationStage> findFirstByLoanIdAndStageName(
            Long loanId,
            StageName stageName);

    List<LoanOriginationStage> findByApplicationId(Long applicationId);
}