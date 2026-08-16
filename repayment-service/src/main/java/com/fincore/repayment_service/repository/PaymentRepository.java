package com.fincore.repayment_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fincore.repayment_service.entity.Payment;

public interface PaymentRepository  extends JpaRepository<Payment,Long>{
		List<Payment> findByLoanId(Long loanId);
}
