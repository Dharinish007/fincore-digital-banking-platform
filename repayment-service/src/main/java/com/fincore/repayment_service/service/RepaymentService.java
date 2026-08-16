package com.fincore.repayment_service.service;

import java.util.List;

import com.fincore.repayment_service.dto.DashboardDTO;
import com.fincore.repayment_service.dto.OutstandingDTO;
import com.fincore.repayment_service.dto.PaymentRequestDTO;
import com.fincore.repayment_service.dto.PaymentResponseDTO;
import com.fincore.repayment_service.entity.Payment;

public interface RepaymentService {
	
	PaymentResponseDTO recordPayment(PaymentRequestDTO request);
	
	List<Payment> getRepaymentHistory(Long loanId);
	
	OutstandingDTO getOutstanding(Long loanId);
	
	DashboardDTO getDashboard(Long loanId);

}

//An interface only declares what methods must exist. The actual implementation is provided in RepaymentServiceImpl.
