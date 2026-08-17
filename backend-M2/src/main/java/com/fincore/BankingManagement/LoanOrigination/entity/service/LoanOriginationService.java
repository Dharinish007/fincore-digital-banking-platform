package com.fincore.BankingManagement.LoanOrigination.entity.service;

import com.fincore.BankingManagement.CreditCheck.entity.Customer;
import com.fincore.BankingManagement.LoanOrigination.entity.ApplicationStatus;
import com.fincore.BankingManagement.LoanOrigination.entity.LoanOrigination;
import com.fincore.BankingManagement.LoanOrigination.entity.Repository.CustomerRepo;
import com.fincore.BankingManagement.LoanOrigination.entity.dto.LoanApplicationRequest;
import com.fincore.BankingManagement.LoanOrigination.entity.dto.LoanApplicationResponse;
import com.fincore.BankingManagement.LoanOrigination.entity.Repository.LoanOriginationRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanOriginationService {

        private final LoanOriginationRepository repository;

        private final LoanProductService loanProductService;

        private final CustomerRepo customerRepository;

        @Transactional
        public LoanOrigination createLoanApplication(
                        LoanApplicationRequest request) {

                // =====================================================
                // 1. Validate Loan Type
                // =====================================================

                if (request.getLoanType() == null) {
                        throw new IllegalArgumentException(
                                        "Loan type is required");
                }

                // =====================================================
                // 2. Validate Loan Amount
                // =====================================================

                BigDecimal loanAmount = request.getLoanAmount();
                if (loanAmount == null) {
                        loanAmount = request.getRequestedAmount();
                }

                if (loanAmount == null ||
                                loanAmount.compareTo(BigDecimal.ZERO) <= 0) {

                        throw new IllegalArgumentException(
                                        "Loan amount must be greater than zero");
                }

                // =====================================================
                // 3. Validate Tenure
                // =====================================================

                if (request.getTenureMonths() == null ||
                                request.getTenureMonths() <= 0) {

                        throw new IllegalArgumentException(
                                        "Tenure must be greater than zero");
                }

                // =====================================================
                // 4. Get Customer Information (if customerId provided)
                // =====================================================

                Long customerId = request.getCustomerId();
                String customerName = request.getCustomerName();

                if (customerName == null) {
                        customerName = request.getFullName();
                }

                if (customerName == null) {
                        customerName = "Unknown Customer";
                }

                // Try to find customer if customerId is provided
                if (customerId != null) {
                        try {
                                Customer customer = customerRepository.findById(
                                                Math.toIntExact(customerId)).orElse(null);

                                if (customer != null) {
                                        customerName = customer.getFullName();
                                }
                        } catch (Exception e) {
                                // Customer not found, use provided name
                        }
                } else {
                        // Generate a default customer ID if not provided
                        customerId = 999999L; // Default ID
                }

                // =====================================================
                // 5. GET INTEREST RATE FROM LOAN PRODUCT OR REQUEST
                // =====================================================

                BigDecimal interestRate = request.getInterestRate();
                if (interestRate == null || interestRate.compareTo(BigDecimal.ZERO) <= 0) {
                        interestRate = loanProductService.getInterestRate(
                                        request.getLoanType());
                }

                // =====================================================
                // 6. CREATE LOAN ENTITY
                // =====================================================

                LoanOrigination loan = new LoanOrigination();

                // Set identifiers
                loan.setCustomerId(customerId);
                loan.setCustomerName(customerName);

                // Set personal information
                loan.setFullName(request.getFullName() != null ? request.getFullName() : customerName);

                if (request.getDateOfBirth() != null) {
                        try {
                                loan.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
                        } catch (Exception e) {
                                // Invalid date format
                        }
                }

                loan.setGender(request.getGender());
                loan.setMobile(request.getMobile());
                loan.setEmail(request.getEmail());

                // Set address information
                loan.setAddress(request.getAddress());
                loan.setCity(request.getCity());
                loan.setState(request.getState());
                loan.setPincode(request.getPincode());

                // Set employment information
                loan.setEmploymentType(request.getEmploymentType());
                loan.setEmployerName(request.getEmployerName());
                loan.setJobTitle(request.getJobTitle());
                loan.setWorkExperience(request.getWorkExperience());

                // Set income information
                loan.setMonthlyIncome(request.getMonthlyIncome());
                loan.setOtherIncome(request.getOtherIncome());

                // Set loan information
                loan.setLoanType(request.getLoanType());
                loan.setLoanAmount(loanAmount);
                loan.setTenureMonths(request.getTenureMonths());
                loan.setInterestRate(interestRate);
                loan.setPurpose(request.getPurpose());

                // Set application status
                ApplicationStatus status = ApplicationStatus.PENDING;
                if (request.getApplicationStatus() != null) {
                        try {
                                status = ApplicationStatus.valueOf(
                                                request.getApplicationStatus().toUpperCase());
                        } catch (Exception e) {
                                status = ApplicationStatus.PENDING;
                        }
                }
                loan.setApplicationStatus(status);

                // Set application date
                loan.setApplicationDate(LocalDate.now());

                // =====================================================
                // 7. SAVE
                // =====================================================

                return repository.save(loan);
        }

        // =========================================================
        // GET ALL LOANS
        // =========================================================

        public List<LoanOrigination> getAllLoanApplications() {
                return repository.findAll();
        }

        // =========================================================
        // GET LOAN BY ID
        // =========================================================

        public LoanOrigination getLoanApplicationById(Long loanId) {
                return repository.findById(loanId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Loan application not found: " + loanId));
        }

        // =========================================================
        // GET LOANS BY CUSTOMER
        // =========================================================

        public List<LoanOrigination> getLoansByCustomerId(Long customerId) {
                return repository.findByCustomerId(customerId);
        }

        // =========================================================
        // GET LOANS BY STATUS
        // =========================================================

        public List<LoanOrigination> getLoansByStatus(ApplicationStatus status) {
                return repository.findByApplicationStatus(status);
        }

        // =========================================================
        // UPDATE LOAN STATUS
        // =========================================================

        @Transactional
        public LoanOrigination updateLoanStatus(
                        Long loanId,
                        ApplicationStatus status) {

                LoanOrigination loan = getLoanApplicationById(loanId);
                loan.setApplicationStatus(status);
                return repository.save(loan);
        }

        // =========================================================
        // CONVERT ENTITY TO RESPONSE DTO
        // =========================================================

        public LoanApplicationResponse convertToResponse(LoanOrigination loan) {
                return LoanApplicationResponse.builder()
                                .loanId(loan.getLoanId())
                                .customerId(loan.getCustomerId())
                                .customerName(loan.getCustomerName())
                                .fullName(loan.getFullName())
                                .dateOfBirth(loan.getDateOfBirth())
                                .gender(loan.getGender())
                                .mobile(loan.getMobile())
                                .email(loan.getEmail())
                                .address(loan.getAddress())
                                .city(loan.getCity())
                                .state(loan.getState())
                                .pincode(loan.getPincode())
                                .employmentType(loan.getEmploymentType())
                                .employerName(loan.getEmployerName())
                                .jobTitle(loan.getJobTitle())
                                .workExperience(loan.getWorkExperience())
                                .monthlyIncome(loan.getMonthlyIncome())
                                .otherIncome(loan.getOtherIncome())
                                .loanType(loan.getLoanType())
                                .loanAmount(loan.getLoanAmount())
                                .tenureMonths(loan.getTenureMonths())
                                .interestRate(loan.getInterestRate())
                                .purpose(loan.getPurpose())
                                .applicationStatus(loan.getApplicationStatus())
                                .applicationDate(loan.getApplicationDate())
                                .createdAt(loan.getCreatedAt())
                                .updatedAt(loan.getUpdatedAt())
                                .build();
        }
        // CONVERT LIST OF ENTITIES TO RESPONSE DTOs

        public List<LoanApplicationResponse> convertToResponseList(List<LoanOrigination> loans) {
                return loans.stream()
                                .map(this::convertToResponse)
                                .collect(Collectors.toList());
        }
}