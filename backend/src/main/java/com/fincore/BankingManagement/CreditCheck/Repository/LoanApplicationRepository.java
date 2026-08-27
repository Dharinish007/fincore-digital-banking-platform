package com.fincore.BankingManagement.CreditCheck.Repository;

import com.fincore.BankingManagement.CreditCheck.entity.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Integer> {
    Optional<LoanApplication> findTopByCustomerCustomerIdOrderByApplicationDateDesc(Long customerId);
}
