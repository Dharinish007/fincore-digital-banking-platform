package com.fincore.BankingManagement.Milestone2.CreditCheck.EMI.repository;

import com.fincore.BankingManagement.EMI.entity.EMICalculation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EMICalculationRepository
        extends JpaRepository<EMICalculation, Long> {

    List<EMICalculation> findByLoanId(Long loanId);
}