package com.fincore.repayment_service.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fincore.repayment_service.dto.DashboardDTO;
import com.fincore.repayment_service.dto.OutstandingDTO;
import com.fincore.repayment_service.dto.PaymentRequestDTO;
import com.fincore.repayment_service.dto.PaymentResponseDTO;
import com.fincore.repayment_service.entity.Payment;
import com.fincore.repayment_service.service.RepaymentService;

@RestController
@RequestMapping("/api/repayments")
public class RepaymentController {
	
	@Autowired
	 private RepaymentService repaymentService;

	 @PostMapping("/pay")
    public PaymentResponseDTO recordPayment(
            @RequestBody PaymentRequestDTO request) {

        return repaymentService.recordPayment(request);
    }
	 
	 @GetMapping("/history/{loanId}")
	 public List<Payment> getRepaymentHistory(
			 @PathVariable Long loanId){
		 return repaymentService.getRepaymentHistory(loanId);
	 }
	 
	 @GetMapping("/outstanding/{loanId}")
	    public OutstandingDTO getOutstanding(
	            @PathVariable Long loanId) {

	        return repaymentService.getOutstanding(loanId);
	    }
	 
	 @GetMapping("/dashboard/{loanId}")
	    public DashboardDTO getDashboard(
	            @PathVariable Long loanId) {

	        return repaymentService.getDashboard(loanId);
	    }
	

}
