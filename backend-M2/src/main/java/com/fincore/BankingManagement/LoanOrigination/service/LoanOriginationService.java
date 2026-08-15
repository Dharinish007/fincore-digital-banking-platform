package com.fincore.BankingManagement.LoanOrigination.service;

import com.fincore.BankingManagement.LoanOrigination.entity.LoanOrigination;
import com.fincore.BankingManagement.LoanOrigination.repository.LoanOriginationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoanOriginationService {

    private final LoanOriginationRepository loanOriginationRepository;

    public LoanOriginationService(LoanOriginationRepository loanOriginationRepository) {
        this.loanOriginationRepository = loanOriginationRepository;
    }

    public LoanOrigination createLoanApplication(LoanOrigination loanOrigination) {

        if (loanOrigination.getCustomerId() == null) {
            throw new IllegalArgumentException("Customer ID is required");
        }

        if (loanOrigination.getLoanType() == null) {
            throw new IllegalArgumentException("Loan type is required");
        }

        if (loanOrigination.getLoanAmount() == null ||
                loanOrigination.getLoanAmount().signum() <= 0) {
            throw new IllegalArgumentException("Loan amount must be greater than zero");
        }

        if (loanOrigination.getTenureMonths() == null ||
                loanOrigination.getTenureMonths() <= 0) {
            throw new IllegalArgumentException("Tenure must be greater than zero");
        }

        if (loanOrigination.getInterestRate() == null ||
                loanOrigination.getInterestRate().signum() < 0) {
            throw new IllegalArgumentException("Interest rate cannot be negative");
        }

        loanOrigination.setApplicationStatus(
                LoanOrigination.ApplicationStatus.Pending
        );

        return loanOriginationRepository.save(loanOrigination);
    }

    public List<LoanOrigination> getAllLoanApplications() {
        return loanOriginationRepository.findAll();
    }

    public LoanOrigination getLoanApplicationById(Long loanId) {

        return loanOriginationRepository.findById(loanId)
                .orElseThrow(() ->
                        new RuntimeException("Loan application not found with ID: " + loanId)
                );
    }

    public List<LoanOrigination> getLoansByCustomerId(Long customerId) {
        return loanOriginationRepository.findByCustomerId(customerId);
    }

    public List<LoanOrigination> getLoansByStatus(
            LoanOrigination.ApplicationStatus status) {

        return loanOriginationRepository.findByApplicationStatus(status);
    }

    public LoanOrigination updateLoanStatus(
            Long loanId,
            LoanOrigination.ApplicationStatus status) {

        LoanOrigination loan = getLoanApplicationById(loanId);

        loan.setApplicationStatus(status);

        return loanOriginationRepository.save(loan);
    }
}