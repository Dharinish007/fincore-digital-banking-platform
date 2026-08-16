package com.fincore.BankingManagement.CreditCheck.Repository;

import com.fincore.BankingManagement.CreditCheck.entity.CreditCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CreditCheckRepository extends JpaRepository<CreditCheck, Integer> {
    Optional<CreditCheck> findByLoanApplicationLoanId(Long loanId);
}
