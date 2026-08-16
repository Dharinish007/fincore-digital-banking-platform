package com.fincore.BankingManagement.LoanOrigination.repository;

import com.fincore.BankingManagement.LoanOrigination.entity.LoanOrigination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanOriginationRepository extends JpaRepository<LoanOrigination, Long> {

    List<LoanOrigination> findByCustomerId(Long customerId);

    List<LoanOrigination> findByApplicationStatus(
            LoanOrigination.ApplicationStatus applicationStatus
    );
}