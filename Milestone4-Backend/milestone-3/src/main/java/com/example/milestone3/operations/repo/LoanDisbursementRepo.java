package com.example.milestone3.operations.repo;

import com.example.milestone3.operations.entity.LoanDisbursement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanDisbursementRepo extends JpaRepository<LoanDisbursement, Long> { }
