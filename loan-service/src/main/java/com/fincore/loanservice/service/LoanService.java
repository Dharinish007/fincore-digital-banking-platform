package com.fincore.loanservice.service;

import com.fincore.loanservice.dto.LoanRequest;
import com.fincore.loanservice.dto.LoanResponse;
import com.fincore.loanservice.enums.LoanStatus;

import java.util.List;

public interface LoanService {

  LoanResponse createLoan(LoanRequest request);

  LoanResponse getLoanById(Long id);

  LoanResponse getLoanByNumber(String loanNumber);

  List<LoanResponse> getLoansByCustomer(Long customerId);

  LoanResponse updateStatus(Long id, LoanStatus status);
}
