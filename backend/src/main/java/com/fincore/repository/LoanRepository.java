package com.fincore.repository;

import com.fincore.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, String> {
    Optional<Loan> findByLoanNumber(String loanNumber);
    List<Loan> findByCustomerId(String customerId);
    List<Loan> findByStatus(Loan.LoanStatus status);
}
