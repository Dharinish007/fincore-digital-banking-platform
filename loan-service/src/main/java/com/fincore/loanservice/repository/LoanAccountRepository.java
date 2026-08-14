package com.fincore.loanservice.repository;

import com.fincore.loanservice.entity.LoanAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoanAccountRepository extends JpaRepository<LoanAccount, Long> {

  Optional<LoanAccount> findByLoanNumber(String loanNumber);

  Optional<LoanAccount> findByCustomerId(Long customerId);
}
