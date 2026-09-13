package com.example.milestone3.loanmanagement.collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("collectionLoanRepo")
public interface LoanRepo extends JpaRepository<LoanEntity,Long> {
}
