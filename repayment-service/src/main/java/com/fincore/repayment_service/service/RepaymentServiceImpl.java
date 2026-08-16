package com.fincore.repayment_service.service;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import java.math.BigDecimal;
import com.fincore.repayment_service.entity.EmiSchedule;
import com.fincore.repayment_service.entity.LoanRepayment;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fincore.repayment_service.dto.DashboardDTO;
import com.fincore.repayment_service.dto.OutstandingDTO;
import com.fincore.repayment_service.dto.PaymentRequestDTO;
import com.fincore.repayment_service.dto.PaymentResponseDTO;
import com.fincore.repayment_service.entity.Payment;
import com.fincore.repayment_service.repository.EmiScheduleRepository;
import com.fincore.repayment_service.repository.LoanRepaymentRepository;
import com.fincore.repayment_service.repository.PaymentRepository;

@Service
public class RepaymentServiceImpl implements RepaymentService {
	@Autowired
	private PaymentRepository paymentRepository;
	
	@Autowired
	private EmiScheduleRepository emiScheduleRepository;
	
	@Autowired
	private LoanRepaymentRepository loanRepaymentRepository;
	@Override
	public PaymentResponseDTO recordPayment(PaymentRequestDTO request) {
		Optional<EmiSchedule> optionalEmi = emiScheduleRepository.findById(request.getEmiId());
		if(optionalEmi.isEmpty()) {
			throw new RuntimeException("EMI not Found"); 
		}
		
		EmiSchedule emi=optionalEmi.get();
		
		Payment payment=new Payment();
		payment.setLoanId(request.getLoanId());
		payment.setEmiId(request.getEmiId());
	    payment.setAmountPaid(request.getAmountPaid());
	    payment.setPaymentMethod(request.getPaymentMethod());
	    payment.setPaymentDate(LocalDate.now());
	    
	    String transactionId =
	            UUID.randomUUID().toString();

	    payment.setTransactionId(transactionId);
	    payment.setPaymentStatus("SUCCESS");

	    paymentRepository.save(payment);
	    
	    BigDecimal currentPaid = emi.getPaidAmount() == null ? BigDecimal.ZERO : emi.getPaidAmount();

	    BigDecimal newPaidAmount =
	            currentPaid.add(request.getAmountPaid());

	    emi.setPaidAmount(newPaidAmount);

	    BigDecimal remainingAmount =
	            emi.getEmiAmount().subtract(newPaidAmount);

	    emi.setRemainingAmount(remainingAmount);
	    
	    if (remainingAmount.compareTo(BigDecimal.ZERO) == 0) {
	        emi.setPaymentStatus("PAID");
	    } else {
	        emi.setPaymentStatus("PARTIALLY_PAID");
	    }

	    emiScheduleRepository.save(emi);
	    Optional<LoanRepayment> optionalLoan =
	            loanRepaymentRepository.findByLoanId(request.getLoanId());

	    if(optionalLoan.isPresent()) {

	        LoanRepayment loan = optionalLoan.get();

	        BigDecimal currentTotalPaid =
	                loan.getTotalPaid() == null
	                ? BigDecimal.ZERO
	                : loan.getTotalPaid();

	        loan.setTotalPaid(
	                currentTotalPaid.add(request.getAmountPaid()));

	        loan.setOutstandingAmount(
	                loan.getOutstandingAmount()
	                        .subtract(request.getAmountPaid()));

	        loanRepaymentRepository.save(loan);
	    }
	    PaymentResponseDTO response = new PaymentResponseDTO();

	    response.setTransactionId(transactionId);
	    response.setPaymentStatus("SUCCESS");
	    response.setMessage("Payment recorded successfully");

	    return response;

	}
	@Override
	public List<Payment> getRepaymentHistory(Long loanId) {
		
		return paymentRepository.findByLoanId(loanId);
	}

	@Override
	public OutstandingDTO getOutstanding(Long loanId) {
		
		
		Optional <LoanRepayment> optionalLoan = loanRepaymentRepository.findByLoanId(loanId);
		
		if(optionalLoan.isEmpty()) {
			throw new RuntimeException("Loan not found");
		}
		
		LoanRepayment loan=optionalLoan.get();
		
		 OutstandingDTO outstandingDTO =
		            new OutstandingDTO();

		    outstandingDTO.setTotalLoanAmount(
		            loan.getLoanAmount());

		    outstandingDTO.setAmountPaid(
		            loan.getTotalPaid());

		    outstandingDTO.setRemainingAmount(
		            loan.getOutstandingAmount());
		return outstandingDTO;
	}

	@Override
	public DashboardDTO getDashboard(Long loanId) {
		
		Optional <LoanRepayment> optionalLoan = loanRepaymentRepository.findByLoanId(loanId);
		if(optionalLoan.isEmpty()) {
			throw new RuntimeException("Loan not found");
		}
		
		LoanRepayment loan= optionalLoan.get();
		List<EmiSchedule> emiList =
		        emiScheduleRepository.findByLoanId(loanId);
		 int paidCount = 0;
		    int remainingCount = 0;

		    String nextEmiDate = null;

		    for (EmiSchedule emi : emiList) {

		        if ("PAID".equals(emi.getPaymentStatus())) {
		            paidCount++;
		        } else {

		            remainingCount++;

		            if (nextEmiDate == null) {
		                nextEmiDate = emi.getDueDate().toString();
		            }
		        }
		    }

		    double progress = 0;

		    if (loan.getLoanAmount().compareTo(BigDecimal.ZERO) > 0) {

		        progress =
		                loan.getTotalPaid()
		                        .multiply(BigDecimal.valueOf(100))
		                        .divide(
		                                loan.getLoanAmount(),
		                                2,
		                                java.math.RoundingMode.HALF_UP)
		                        .doubleValue();
		    }

		    DashboardDTO dashboard = new DashboardDTO();

		    dashboard.setTotalPaid(
		            loan.getTotalPaid());

		    dashboard.setTotalOutstanding(
		            loan.getOutstandingAmount());

		    dashboard.setNextEmiDate(
		            nextEmiDate);

		    dashboard.setPaidEmiCount(
		            paidCount);

		    dashboard.setRemainingEmiCount(
		            remainingCount);

		    dashboard.setProgressPercentage(
		            progress);

		    dashboard.setRiskIndicator(
		            loan.getRiskIndicator());

		    return dashboard;
	}

}
