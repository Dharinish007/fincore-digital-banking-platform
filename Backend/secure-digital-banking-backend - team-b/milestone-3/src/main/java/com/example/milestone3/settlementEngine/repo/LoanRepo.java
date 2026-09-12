package com.example.milestone3.settlementEngine.repo;

import com.example.milestone3.settlementEngine.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepo extends JpaRepository<Loan,Long> {
}
