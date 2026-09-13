package com.example.milestone3.operations.repo;

import com.example.milestone3.operations.entity.LoanCollection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanCollectionRepo extends JpaRepository<LoanCollection, Long> {
    List<LoanCollection> findByLoanIdOrderByCollectedAtDesc(Long loanId);
}
