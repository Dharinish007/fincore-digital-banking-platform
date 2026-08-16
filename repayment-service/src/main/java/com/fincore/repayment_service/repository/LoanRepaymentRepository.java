package com.fincore.repayment_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fincore.repayment_service.entity.LoanRepayment;

@Repository
public interface LoanRepaymentRepository
        extends JpaRepository<LoanRepayment, Long> {

    Optional<LoanRepayment> findByLoanId(Long loanId);

}
