package com.fincore.loanservice.service;

import com.fincore.loanservice.dto.LoanRequest;
import com.fincore.loanservice.dto.LoanResponse;
import com.fincore.loanservice.entity.LoanAccount;
import com.fincore.loanservice.enums.LoanStatus;
import com.fincore.loanservice.exception.LoanNotFoundException;
import com.fincore.loanservice.repository.LoanAccountRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class LoanServiceImpl implements LoanService {

  private final LoanAccountRepository loanRepository;

  public LoanServiceImpl(
    LoanAccountRepository loanRepository) {
    this.loanRepository = loanRepository;
  }

  @Override
  public LoanResponse createLoan(
    LoanRequest request) {

    LoanAccount loan = new LoanAccount();

    loan.setLoanNumber(
      generateLoanNumber()
    );

    loan.setCustomerId(
      request.getCustomerId()
    );

    loan.setLoanAmount(
      request.getLoanAmount()
    );

    loan.setInterestRate(
      request.getInterestRate()
    );

    loan.setTenureMonths(
      request.getTenureMonths()
    );

    loan.setDisbursedAmount(
      BigDecimal.ZERO
    );

    loan.setOutstandingAmount(
      request.getLoanAmount()
    );

    loan.setStatus(
      LoanStatus.PENDING
    );

    LoanAccount savedLoan =
      loanRepository.save(loan);

    return convertToResponse(savedLoan);
  }

  @Override
  public LoanResponse getLoanById(Long id) {

    LoanAccount loan =
      loanRepository.findById(id)
        .orElseThrow(() ->
          new LoanNotFoundException(
            "Loan not found with ID: "
              + id
          )
        );

    return convertToResponse(loan);
  }

  @Override
  public LoanResponse getLoanByNumber(
    String loanNumber) {

    LoanAccount loan =
      loanRepository
        .findByLoanNumber(loanNumber)
        .orElseThrow(() ->
          new LoanNotFoundException(
            "Loan not found: "
              + loanNumber
          )
        );

    return convertToResponse(loan);
  }

  @Override
  public List<LoanResponse> getLoansByCustomer(
    Long customerId) {

    return loanRepository
      .findByCustomerId(customerId)
      .stream()
      .map(this::convertToResponse)
      .toList();
  }

  @Override
  public LoanResponse updateStatus(
    Long id,
    LoanStatus status) {

    LoanAccount loan =
      loanRepository.findById(id)
        .orElseThrow(() ->
          new LoanNotFoundException(
            "Loan not found with ID: "
              + id
          )
        );

    loan.setStatus(status);

    LoanAccount updatedLoan =
      loanRepository.save(loan);

    return convertToResponse(updatedLoan);
  }

  private String generateLoanNumber() {

    return "LN-" +
      System.currentTimeMillis();
  }

  private LoanResponse convertToResponse(
    LoanAccount loan) {

    LoanResponse response =
      new LoanResponse();

    response.setLoanAccountId(
      loan.getLoanAccountId()
    );

    response.setLoanNumber(
      loan.getLoanNumber()
    );

    response.setCustomerId(
      loan.getCustomerId()
    );

    response.setLoanAmount(
      loan.getLoanAmount()
    );

    response.setInterestRate(
      loan.getInterestRate()
    );

    response.setTenureMonths(
      loan.getTenureMonths()
    );

    response.setDisbursedAmount(
      loan.getDisbursedAmount()
    );

    response.setOutstandingAmount(
      loan.getOutstandingAmount()
    );

    response.setStatus(
      loan.getStatus()
    );

    return response;
  }
}
