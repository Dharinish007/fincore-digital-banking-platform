package com.example.milestone2loanmanagement.collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanRepo extends JpaRepository<LoanEntity,Long> {
}
