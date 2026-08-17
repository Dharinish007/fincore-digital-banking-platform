package com.fincore.BankingManagement.LoanOrigination.entity.Repository;

import com.fincore.BankingManagement.LoanOrigination.entity.ApplicationStatus;
import com.fincore.BankingManagement.LoanOrigination.entity.LoanOrigination;
import com.fincore.BankingManagement.LoanOrigination.entity.LoanType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanOriginationRepository
        extends JpaRepository<LoanOrigination, Long> {

    List<LoanOrigination> findByCustomerId(Long customerId);

    List<LoanOrigination> findByApplicationStatus(
            ApplicationStatus status
    );

    List<LoanOrigination> findByLoanType(
            LoanType loanType
    );
}