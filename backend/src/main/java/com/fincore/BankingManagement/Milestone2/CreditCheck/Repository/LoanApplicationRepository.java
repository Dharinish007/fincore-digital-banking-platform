package com.fincore.BankingManagement.Milestone2.CreditCheck.Repository;

import com.fincore.BankingManagement.Milestone2.CreditCheck.entity.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Integer> {
    Optional<LoanApplication> findTopByCustomerCustomerIdOrderByApplicationDateDesc(Long customerId);
}
