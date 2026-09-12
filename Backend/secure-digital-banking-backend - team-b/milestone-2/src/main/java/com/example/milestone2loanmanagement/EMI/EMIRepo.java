package com.example.milestone2loanmanagement.EMI;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
@Repository
public interface EMIRepo extends JpaRepository<EMIEntity,Long> {
    List<EMIEntity> findByLoanIdOrderByInstallmentNumber(Long loanId);

}
