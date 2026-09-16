package com.fincore.BankingManagement.Milestone2.CreditCheck.entity.Repository;

import com.fincore.BankingManagement.Milestone2.CreditCheck.entity.ApplicationStatus;
import com.fincore.BankingManagement.Milestone2.CreditCheck.entity.LoanType;

import com.fincore.BankingManagement.Milestone2.CreditCheck.entity.LoanOrigination;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanOriginationRepository
                extends JpaRepository<LoanOrigination, Long> {

        List<LoanOrigination> findByCustomerId(Long customerId);

        List<LoanOrigination> findByApplicationStatus(
                        ApplicationStatus status);

        List<LoanOrigination> findByLoanType(
                        LoanType loanType);
}