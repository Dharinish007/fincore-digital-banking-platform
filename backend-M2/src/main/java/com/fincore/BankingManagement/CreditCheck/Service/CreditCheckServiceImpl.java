package com.fincore.BankingManagement.CreditCheck.Service;

import com.fincore.BankingManagement.CreditCheck.Repository.CreditCheckRepository;
import com.fincore.BankingManagement.CreditCheck.Repository.CustomerRepository;
import com.fincore.BankingManagement.CreditCheck.Repository.LoanApplicationRepository;
import com.fincore.BankingManagement.CreditCheck.Repository.LoanHistoryRepository;
import com.fincore.BankingManagement.CreditCheck.dto.CreditCheckRequest;
import com.fincore.BankingManagement.CreditCheck.dto.CreditCheckResponse;
import com.fincore.BankingManagement.CreditCheck.dto.CustomerLookupResponse;
import com.fincore.BankingManagement.CreditCheck.dto.PreviousLoanResponse;
import com.fincore.BankingManagement.CreditCheck.entity.CreditCheck;
import com.fincore.BankingManagement.CreditCheck.entity.Customer;
import com.fincore.BankingManagement.CreditCheck.entity.LoanApplication;
import com.fincore.BankingManagement.CreditCheck.entity.LoanHistory;
import com.fincore.BankingManagement.CreditCheck.enums.ApplicationStatus;
import com.fincore.BankingManagement.CreditCheck.enums.CreditStatus;
import com.fincore.BankingManagement.CreditCheck.enums.PreviousLoanStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CreditCheckServiceImpl {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private LoanApplicationRepository loanApplicationRepository;

    @Autowired
    private CreditCheckRepository creditCheckRepository;

    @Autowired
    private LoanHistoryRepository loanHistoryRepository;

    @Transactional(readOnly = true)
    public CustomerLookupResponse getCustomerProfile(Long customerId) {
        Customer customer = getRequiredCustomer(customerId);
        LoanApplication latestApplication = loanApplicationRepository
                .findTopByCustomerCustomerIdOrderByApplicationDateDesc(customerId)
                .orElse(null);

        List<PreviousLoanResponse> previousLoans = loanHistoryRepository
                .findByCustomerCustomerIdOrderByStartDateDesc(customerId)
                .stream()
                .map(this::toPreviousLoanResponse)
                .toList();

        CustomerLookupResponse response = new CustomerLookupResponse();
        response.setCustomerId(customer.getCustomerId());
        response.setCustomerName(customer.getFullName());
        response.setMonthlyIncome(customer.getSalary());
        response.setPreviousLoans(previousLoans);
        if (latestApplication != null) {
            response.setLoanId(latestApplication.getLoanId());
            response.setLoanType(latestApplication.getLoanType());
            response.setLoanAmount(latestApplication.getLoanAmount());
        }
        return response;
    }

    @Transactional(readOnly = true)
    public CreditCheckResponse evaluateEligibility(CreditCheckRequest request) {
        validateEligibilityRequest(request);
        Customer customer = getRequiredCustomer(request.getCustomerId().longValue());
        List<LoanHistory> previousLoans = loanHistoryRepository
                .findByCustomerCustomerIdOrderByStartDateDesc(customer.getCustomerId());

        int existingLoanCount = previousLoans.size();
        BigDecimal outstandingAmount = previousLoans.stream()
                .map(LoanHistory::getOutstandingAmount)
                .filter(amount -> amount != null && amount.signum() > 0)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        boolean hasDefault = previousLoans.stream()
                .anyMatch(loan -> "DEFAULTED".equalsIgnoreCase(loan.getLoanStatus()));

        double monthlyRate = 0.12 / 12;
        int tenureMonths = 36;
        double loanAmount = request.getLoanAmount().doubleValue();
        double estimatedEmi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths))
                / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
        double debtToIncome = (outstandingAmount.doubleValue() / tenureMonths + estimatedEmi)
                / request.getMonthlyIncome().doubleValue();

        CreditStatus status;
        String remarks;
        int creditScore = request.getCreditScore();
        if (hasDefault) {
            status = CreditStatus.FAIL;
            remarks = "Customer has a defaulted loan on record. Application does not meet lending criteria.";
        } else if (creditScore < 600) {
            status = CreditStatus.FAIL;
            remarks = "Credit score (" + creditScore + ") is below the minimum threshold of 600.";
        } else if (existingLoanCount >= 4) {
            status = CreditStatus.FAIL;
            remarks = "Customer already holds " + existingLoanCount + " loans, exceeding the maximum allowed.";
        } else if (debtToIncome > 0.60) {
            status = CreditStatus.FAIL;
            remarks = "Debt-to-income ratio is " + Math.round(debtToIncome * 100) + "%, exceeding the 60% cap.";
        } else if (creditScore < 700 || debtToIncome > 0.40 || existingLoanCount > 0) {
            status = CreditStatus.REVIEW;
            remarks = creditScore < 700
                    ? "Credit score (" + creditScore + ") is in the fair range (600-699); requires manual underwriting review."
                    : debtToIncome > 0.40
                            ? "Debt-to-income ratio is " + Math.round(debtToIncome * 100)
                                    + "%, above the comfortable 40% level."
                            : "Customer has existing loan history; requires manual underwriting review before approval.";
        } else {
            status = CreditStatus.PASS;
            remarks = "Meets standard lending criteria. No further review required.";
        }

        CreditCheckResponse response = new CreditCheckResponse();
        response.setCustomerId(Math.toIntExact(customer.getCustomerId()));
        response.setCustomerName(customer.getFullName());
        response.setLoanId(request.getLoanId());
        response.setLoanType(request.getLoanType());
        response.setLoanAmount(request.getLoanAmount());
        response.setMonthlyIncome(request.getMonthlyIncome());
        response.setCreditScore(creditScore);
        response.setExistingLoanCount(existingLoanCount);
        response.setCreditStatus(toFrontendCreditStatus(status));
        response.setRemarks(remarks);
        response.setMessage("Eligibility calculated from database loan history");
        return response;
    }

    @Transactional
    public CreditCheckResponse saveCreditCheck(CreditCheckRequest request) {
        CreditCheckResponse response = evaluateEligibility(request);
        Customer customer = getRequiredCustomer(request.getCustomerId().longValue());
        LoanApplication loanApplication;
        if (request.getLoanId() == null) {
            loanApplication = new LoanApplication();
            loanApplication.setCustomer(customer);
            loanApplication.setLoanType(request.getLoanType());
            loanApplication.setLoanAmount(request.getLoanAmount());
            loanApplication.setTenureMonths(36);
            loanApplication.setInterestRate(new BigDecimal("12.00"));
            loanApplication.setPurpose(request.getLoanType() + " loan requirement");
            loanApplication.setApplicationStatus(ApplicationStatus.PENDING);
            loanApplication.setApplicationDate(LocalDateTime.now());
            loanApplication = loanApplicationRepository.save(loanApplication);
        } else {
            loanApplication = loanApplicationRepository.findById(request.getLoanId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Loan application is not available for this customer."));
        }

        CreditCheck creditCheck = new CreditCheck();
        creditCheck.setLoanApplication(loanApplication);
        creditCheck.setCreditScore(request.getCreditScore());
        creditCheck.setMonthlyIncome(request.getMonthlyIncome());
        creditCheck.setExistingLoanCount(response.getExistingLoanCount());
        creditCheck.setPreviousLoanStatus(
                response.getExistingLoanCount() > 0
                        ? PreviousLoanStatus.YES
                        : PreviousLoanStatus.NO);
        creditCheck.setCreditStatus(CreditStatus.valueOf(response.getCreditStatus().toUpperCase()));
        creditCheck.setRemarks(response.getRemarks());
        creditCheck.setCheckedAt(LocalDateTime.now());

        CreditCheck saved = creditCheckRepository.save(creditCheck);

        response.setCreditCheckId(saved.getCreditCheckId());
        response.setLoanId(loanApplication.getLoanId());
        response.setLoanType(loanApplication.getLoanType());
        response.setLoanAmount(loanApplication.getLoanAmount());
        response.setCheckedAt(saved.getCheckedAt());
        response.setMessage("Credit check saved successfully");

        return response;
    }

    @Transactional(readOnly = true)
    public List<CreditCheckResponse> getAllCreditChecks() {
        List<CreditCheck> checks = creditCheckRepository.findAll();
        List<CreditCheckResponse> responses = new ArrayList<>();

        for (CreditCheck check : checks) {
            LoanApplication application = check.getLoanApplication();
            Customer customer = application != null ? application.getCustomer() : null;

            CreditCheckResponse response = new CreditCheckResponse();
            response.setCreditCheckId(check.getCreditCheckId());
            response.setCustomerId(
                    customer != null && customer.getCustomerId() != null ? Math.toIntExact(customer.getCustomerId())
                            : null);
            response.setCustomerName(customer != null ? customer.getFullName() : null);
            response.setLoanId(application != null ? application.getLoanId() : null);
            response.setLoanType(application != null ? application.getLoanType() : null);
            response.setLoanAmount(application != null ? application.getLoanAmount() : null);
            response.setMonthlyIncome(check.getMonthlyIncome());
            response.setCreditScore(check.getCreditScore());
            response.setExistingLoanCount(check.getExistingLoanCount());
            response.setCreditStatus(toFrontendCreditStatus(check.getCreditStatus()));
            response.setRemarks(check.getRemarks());
            response.setCheckedAt(check.getCheckedAt());
            response.setMessage("Credit check retrieved successfully");
            responses.add(response);
        }

        return responses;
    }

    private Customer getRequiredCustomer(Long customerId) {
        if (customerId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer ID is required.");
        }
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Customer ID is not available in the database."));
    }

    private void validateEligibilityRequest(CreditCheckRequest request) {
        if (request == null || request.getCustomerId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer ID is required.");
        }
        if (request.getLoanType() == null || request.getLoanType().isBlank()
                || request.getLoanAmount() == null || request.getLoanAmount().signum() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loan type and a positive loan amount are required.");
        }
        if (request.getMonthlyIncome() == null || request.getMonthlyIncome().signum() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A positive monthly salary is required.");
        }
        if (request.getCreditScore() == null || request.getCreditScore() < 300 || request.getCreditScore() > 900) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Credit score must be between 300 and 900.");
        }
    }

    private PreviousLoanResponse toPreviousLoanResponse(LoanHistory loanHistory) {
        PreviousLoanResponse response = new PreviousLoanResponse();
        response.setLoanId(loanHistory.getLoanApplication() != null
                ? loanHistory.getLoanApplication().getLoanId().longValue()
                : loanHistory.getHistoryId());
        response.setLoanType(loanHistory.getLoanType());
        response.setAmount(loanHistory.getLoanAmount());
        response.setOutstandingAmount(loanHistory.getOutstandingAmount());
        response.setStatus(toFrontendLoanStatus(loanHistory.getLoanStatus()));
        return response;
    }

    /**
     * The Angular client uses title-case credit statuses (Pass, Review, Fail),
     * while the database enum is stored in upper case.
     */
    private String toFrontendCreditStatus(CreditStatus status) {
        if (status == null) {
            return null;
        }

        return switch (status) {
            case PASS -> "Pass";
            case REVIEW -> "Review";
            case FAIL -> "Fail";
        };
    }

    private String toFrontendLoanStatus(String status) {
        if (status == null) {
            return "Closed";
        }
        return switch (status.toUpperCase()) {
            case "ACTIVE" -> "Active";
            case "DEFAULTED" -> "Defaulted";
            default -> "Closed";
        };
    }
}
