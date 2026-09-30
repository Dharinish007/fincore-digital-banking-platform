package com.fincore.repository;

import com.fincore.entity.RepaymentSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RepaymentScheduleRepository extends JpaRepository<RepaymentSchedule, String> {
    List<RepaymentSchedule> findByLoanIdOrderByInstallmentNumberAsc(String loanId);
    List<RepaymentSchedule> findByLoanIdAndStatus(String loanId, RepaymentSchedule.PaymentStatus status);
}
