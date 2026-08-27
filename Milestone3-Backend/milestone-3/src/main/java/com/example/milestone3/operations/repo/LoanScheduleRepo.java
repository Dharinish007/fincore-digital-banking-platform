package com.example.milestone3.operations.repo;

import com.example.milestone3.operations.entity.LoanSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanScheduleRepo extends JpaRepository<LoanSchedule, Long> {
    List<LoanSchedule> findByLoanIdOrderByInstallmentNumber(Long loanId);
}
