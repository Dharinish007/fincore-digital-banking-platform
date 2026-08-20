package com.fincore.loan.service;

import com.fincore.loan.dto.LoanResponse;
import com.fincore.loan.dto.LoanStatisticsResponse;
import com.fincore.loan.dto.RepaymentScheduleResponse;
import com.fincore.loan.enums.LoanStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LoanService {

    LoanResponse getLoanById(Long id);

    LoanResponse getLoanByNumber(String loanNumber);

    Page<LoanResponse> getLoansByCustomerId(Long customerId, Pageable pageable);

    Page<LoanResponse> getAllLoans(Long customerId, LoanStatus status, Pageable pageable);

    RepaymentScheduleResponse getRepaymentSchedule(Long id);

    LoanResponse disburseLoan(Long id);

    LoanStatisticsResponse getStatistics();
}
