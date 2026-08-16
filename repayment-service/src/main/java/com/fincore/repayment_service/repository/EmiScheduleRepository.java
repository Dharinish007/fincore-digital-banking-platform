package com.fincore.repayment_service.repository;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;

import com.fincore.repayment_service.entity.EmiSchedule;

public interface EmiScheduleRepository extends JpaRepository <EmiSchedule, Long>{
		List<EmiSchedule> findByLoanId(Long loanId);
}
