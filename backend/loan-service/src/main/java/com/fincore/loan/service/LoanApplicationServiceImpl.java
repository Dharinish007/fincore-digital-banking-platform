package com.fincore.loan.service;

import com.fincore.loan.client.AccountClient;
import com.fincore.loan.client.CustomerClient;
import com.fincore.loan.dto.*;
import com.fincore.loan.entity.CreditAssessment;
import com.fincore.loan.entity.Loan;
import com.fincore.loan.entity.LoanApplication;
import com.fincore.loan.entity.LoanProduct;
import com.fincore.loan.enums.ApplicationStatus;
import com.fincore.loan.enums.AssessmentDecision;
import com.fincore.loan.enums.LoanProductStatus;
import com.fincore.loan.enums.LoanStatus;
import com.fincore.loan.exception.*;
import com.fincore.loan.repository.CreditAssessmentRepository;
import com.fincore.loan.repository.LoanApplicationRepository;
import com.fincore.loan.repository.LoanProductRepository;
import com.fincore.loan.repository.LoanRepository;
import com.fincore.loan.security.UserContext;
import com.fincore.loan.security.UserContextHolder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoanApplicationServiceImpl implements LoanApplicationService {

    private final LoanApplicationRepository applicationRepository;
    private final LoanProductRepository productRepository;
    private final CreditAssessmentRepository assessmentRepository;
    private final LoanRepository loanRepository;
    private final CustomerClient customerClient;
    private final AccountClient accountClient;
    private final CreditAssessmentEngine creditAssessmentEngine;
    private final EmiCalculatorService emiCalculatorService;

    @Override
    @Transactional
    public LoanApplicationResponse submitApplication(LoanApplicationRequest request) {
        UserContext authUser = UserContextHolder.getContext();
        if (authUser == null) {
            throw new LoanOwnershipViolationException("Access denied: Authentication required to submit loan application");
        }
        if (authUser.isCustomer()) {
            if (authUser.getCustomerId() == null) {
                throw new LoanOwnershipViolationException("Access denied: Authenticated customer has no associated customer profile");
            }
            if (request.getCustomerId() != null && !request.getCustomerId().equals(authUser.getCustomerId())) {
                log.warn("Customer {} attempted to submit loan application for customer ID {}",
                        authUser.getCustomerId(), request.getCustomerId());
                throw new LoanOwnershipViolationException(String.format(
                        "Access denied: Cannot submit loan application for customer ID %d (authenticated as customer ID %d)",
                        request.getCustomerId(), authUser.getCustomerId()));
            }
            request.setCustomerId(authUser.getCustomerId());
        } else if (authUser.isEmployee() || authUser.isAdmin()) {
            if (request.getCustomerId() == null) {
                throw new IllegalArgumentException("Customer ID is required when employee/admin creates a loan application");
            }
        }

        if (request.getCustomerId() == null) {
            throw new IllegalArgumentException("Customer ID is required");
        }

        log.info("Processing loan application for customer ID: {}", request.getCustomerId());

        // 1. Verify Loan Product exists and is ACTIVE
        LoanProduct product = productRepository.findById(request.getLoanProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Loan product not found with ID: " + request.getLoanProductId()));

        if (product.getStatus() != LoanProductStatus.ACTIVE) {
            throw new EligibilityException("Loan product is currently inactive and not accepting applications");
        }

        // 2. Validate requested amount within product limits
        if (request.getRequestedAmount().compareTo(product.getMinAmount()) < 0 ||
                request.getRequestedAmount().compareTo(product.getMaxAmount()) > 0) {
            throw new EligibilityException(String.format("Requested amount ($%s) must be between $%s and $%s for product '%s'",
                    request.getRequestedAmount(), product.getMinAmount(), product.getMaxAmount(), product.getName()));
        }

        // 3. Validate requested tenure within product limits
        if (request.getRequestedTenureMonths() < product.getMinTenureMonths() ||
                request.getRequestedTenureMonths() > product.getMaxTenureMonths()) {
            throw new EligibilityException(String.format("Requested tenure (%d months) must be between %d and %d months for product '%s'",
                    request.getRequestedTenureMonths(), product.getMinTenureMonths(), product.getMaxTenureMonths(), product.getName()));
        }

        // 4. Verify Customer exists and is ACTIVE
        CustomerResponse customer = customerClient.getCustomerById(request.getCustomerId());
        if (customer == null) {
            throw new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId());
        }
        if (customer.getStatus() != null && !"ACTIVE".equalsIgnoreCase(customer.getStatus())) {
            throw new EligibilityException("Customer account is not active (Status: " + customer.getStatus() + ")");
        }

        // 5. Verify Account exists, is ACTIVE, and belongs to the customer
        AccountResponse account = null;
        if (request.getAccountNumber() != null && !request.getAccountNumber().trim().isEmpty()) {
            account = accountClient.getAccountByNumber(request.getAccountNumber().trim());
        } else if (request.getAccountId() != null) {
            account = accountClient.getAccountById(request.getAccountId());
        }

        if (account == null) {
            throw new ResourceNotFoundException("Specified disbursement account not found");
        }

        if (account.getCustomerId() == null || !account.getCustomerId().equals(customer.getId())) {
            log.warn("Account ownership check failed: customerId={}, accountNumber={}, accountOwner={}",
                    customer.getId(), account.getAccountNumber(), account.getCustomerId());
            throw new LoanOwnershipViolationException(String.format("Account '%s' does not belong to customer ID %d",
                    account.getAccountNumber(), customer.getId()));
        }

        if (account.getStatus() != null && !"ACTIVE".equalsIgnoreCase(account.getStatus())) {
            throw new EligibilityException("Disbursement account is not active (Status: " + account.getStatus() + ")");
        }

        // 6. Build and persist Loan Application
        String applicationNumber = "APP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        LoanApplication application = LoanApplication.builder()
                .applicationNumber(applicationNumber)
                .customerId(customer.getId())
                .accountId(account.resolveId())
                .accountNumber(account.getAccountNumber())
                .loanProduct(product)
                .requestedAmount(request.getRequestedAmount())
                .requestedTenureMonths(request.getRequestedTenureMonths())
                .purpose(request.getPurpose())
                .monthlyIncome(request.getMonthlyIncome())
                .monthlyExpenses(request.getMonthlyExpenses())
                .status(ApplicationStatus.SUBMITTED)
                .remarks(request.getRemarks())
                .build();

        LoanApplication saved = applicationRepository.save(application);
        log.info("Loan application submitted successfully: {}", saved.getApplicationNumber());

        return LoanApplicationResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public LoanApplicationResponse getApplicationById(Long id) {
        LoanApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with ID: " + id));

        UserContext authUser = UserContextHolder.getContext();
        if (authUser == null) {
            throw new LoanOwnershipViolationException("Access denied: Authentication required");
        }
        if (authUser.isCustomer()) {
            if (authUser.getCustomerId() == null || !app.getCustomerId().equals(authUser.getCustomerId())) {
                log.warn("Customer {} attempted unauthorized access to loan application {}",
                        authUser.getCustomerId(), app.getApplicationNumber());
                throw new LoanOwnershipViolationException("Access denied: You do not have permission to view this loan application");
            }
        }

        LoanApplicationResponse response = LoanApplicationResponse.from(app);
        assessmentRepository.findByApplicationId(id)
                .ifPresent(ca -> response.setCreditAssessment(CreditAssessmentResponse.from(ca)));

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public LoanApplicationResponse getApplicationByNumber(String applicationNumber) {
        LoanApplication app = applicationRepository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with number: " + applicationNumber));

        UserContext authUser = UserContextHolder.getContext();
        if (authUser == null) {
            throw new LoanOwnershipViolationException("Access denied: Authentication required");
        }
        if (authUser.isCustomer()) {
            if (authUser.getCustomerId() == null || !app.getCustomerId().equals(authUser.getCustomerId())) {
                log.warn("Customer {} attempted unauthorized access to loan application {}",
                        authUser.getCustomerId(), app.getApplicationNumber());
                throw new LoanOwnershipViolationException("Access denied: You do not have permission to view this loan application");
            }
        }

        LoanApplicationResponse response = LoanApplicationResponse.from(app);
        assessmentRepository.findByApplicationId(app.getId())
                .ifPresent(ca -> response.setCreditAssessment(CreditAssessmentResponse.from(ca)));

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LoanApplicationResponse> getApplicationsByCustomerId(Long customerId, Pageable pageable) {
        UserContext authUser = UserContextHolder.getContext();
        if (authUser == null) {
            throw new LoanOwnershipViolationException("Access denied: Authentication required");
        }
        if (authUser.isCustomer()) {
            if (authUser.getCustomerId() == null || !customerId.equals(authUser.getCustomerId())) {
                log.warn("Customer {} attempted unauthorized access to loan applications for customer {}",
                        authUser.getCustomerId(), customerId);
                throw new LoanOwnershipViolationException(String.format(
                        "Access denied: Cannot view loan applications for customer ID %d", customerId));
            }
        }

        return applicationRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable)
                .map(LoanApplicationResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LoanApplicationResponse> getAllApplications(Long customerId, ApplicationStatus status, Pageable pageable) {
        UserContext authUser = UserContextHolder.getContext();
        if (authUser == null) {
            throw new LoanOwnershipViolationException("Access denied: Authentication required");
        }

        final Long effectiveCustomerId;
        if (authUser.isCustomer()) {
            if (authUser.getCustomerId() == null) {
                throw new LoanOwnershipViolationException("Access denied: Customer identity not found in security context");
            }
            if (customerId != null && !customerId.equals(authUser.getCustomerId())) {
                throw new LoanOwnershipViolationException("Access denied: You cannot view loan applications of another customer");
            }
            effectiveCustomerId = authUser.getCustomerId();
        } else {
            effectiveCustomerId = customerId;
        }

        if (effectiveCustomerId != null && status != null) {
            return applicationRepository.findAll((root, query, cb) ->
                    cb.and(cb.equal(root.get("customerId"), effectiveCustomerId), cb.equal(root.get("status"), status)), pageable)
                    .map(LoanApplicationResponse::from);
        } else if (effectiveCustomerId != null) {
            return applicationRepository.findByCustomerIdOrderByCreatedAtDesc(effectiveCustomerId, pageable)
                    .map(LoanApplicationResponse::from);
        } else if (status != null) {
            return applicationRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                    .map(LoanApplicationResponse::from);
        } else {
            return applicationRepository.findAll(pageable).map(LoanApplicationResponse::from);
        }
    }

    @Override
    @Transactional
    public CreditAssessmentResponse assessApplication(Long id) {
        UserContext authUser = UserContextHolder.getContext();
        if (authUser == null || !authUser.isEmployee()) {
            log.warn("Non-employee user attempted to assess loan application ID {}", id);
            throw new LoanOwnershipViolationException("Access denied: Only loan officers (EMPLOYEE) can perform credit assessment");
        }

        LoanApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with ID: " + id));

        if (app.getStatus() == ApplicationStatus.APPROVED || app.getStatus() == ApplicationStatus.REJECTED || app.getStatus() == ApplicationStatus.CANCELLED) {
            throw new InvalidApplicationStateException("Cannot assess an application that is already " + app.getStatus());
        }

        CreditAssessment assessment = creditAssessmentEngine.assessApplication(app);

        // Save or update existing assessment
        CreditAssessment savedAssessment = assessmentRepository.findByApplicationId(id)
                .map(existing -> {
                    existing.setCreditScore(assessment.getCreditScore());
                    existing.setRiskLevel(assessment.getRiskLevel());
                    existing.setDecision(assessment.getDecision());
                    existing.setAssessedMonthlyIncome(assessment.getAssessedMonthlyIncome());
                    existing.setAssessedMonthlyExpenses(assessment.getAssessedMonthlyExpenses());
                    existing.setExistingMonthlyDebt(assessment.getExistingMonthlyDebt());
                    existing.setDebtToIncomeRatio(assessment.getDebtToIncomeRatio());
                    existing.setProposedEmi(assessment.getProposedEmi());
                    existing.setMaxEligibleAmount(assessment.getMaxEligibleAmount());
                    existing.setScoreBreakdown(assessment.getScoreBreakdown());
                    existing.setAssessmentSummary(assessment.getAssessmentSummary());
                    existing.setAssessedAt(assessment.getAssessedAt());
                    return assessmentRepository.save(existing);
                })
                .orElseGet(() -> assessmentRepository.save(assessment));

        app.setStatus(ApplicationStatus.CREDIT_ASSESSED);
        applicationRepository.save(app);

        log.info("Credit assessment completed for application {}: Score={}, Decision={}",
                app.getApplicationNumber(), savedAssessment.getCreditScore(), savedAssessment.getDecision());

        return CreditAssessmentResponse.from(savedAssessment);
    }

    @Override
    @Transactional(readOnly = true)
    public CreditAssessmentResponse getCreditAssessment(Long id) {
        LoanApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with ID: " + id));

        UserContext authUser = UserContextHolder.getContext();
        if (authUser == null) {
            throw new LoanOwnershipViolationException("Access denied: Authentication required");
        }
        if (authUser.isCustomer()) {
            if (authUser.getCustomerId() == null || !app.getCustomerId().equals(authUser.getCustomerId())) {
                throw new LoanOwnershipViolationException("Access denied: You do not have permission to view credit assessment for this application");
            }
        }

        CreditAssessment ca = assessmentRepository.findByApplicationId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Credit assessment not found for application ID: " + id));
        return CreditAssessmentResponse.from(ca);
    }

    @Override
    @Transactional
    public LoanResponse approveApplication(Long id, ApprovalRequest request) {
        UserContext authUser = UserContextHolder.getContext();
        if (authUser == null || !authUser.isEmployee()) {
            log.warn("Non-employee user attempted to approve loan application ID {}", id);
            throw new LoanOwnershipViolationException("Access denied: Only loan officers (EMPLOYEE) can approve loan applications");
        }

        LoanApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with ID: " + id));

        // State Machine validation
        if (app.getStatus() == ApplicationStatus.APPROVED) {
            throw new InvalidApplicationStateException("Application is already approved");
        }
        if (app.getStatus() == ApplicationStatus.REJECTED || app.getStatus() == ApplicationStatus.CANCELLED) {
            throw new InvalidApplicationStateException("Cannot approve an application in status: " + app.getStatus());
        }

        // Must have completed credit assessment
        CreditAssessment assessment = assessmentRepository.findByApplicationId(id)
                .orElseThrow(() -> new CreditAssessmentException("Cannot approve application without completed credit assessment. Run assessment first."));

        if (assessment.getDecision() == AssessmentDecision.REJECTED) {
            throw new EligibilityException("Application was assessed as REJECTED due to high risk: " + assessment.getAssessmentSummary());
        }

        // Transition status to APPROVED
        app.setStatus(ApplicationStatus.APPROVED);
        if (request != null && request.getOfficerNotes() != null) {
            app.setRemarks((app.getRemarks() != null ? app.getRemarks() + " | " : "") + "Approval Note: " + request.getOfficerNotes());
        }
        applicationRepository.save(app);

        // Create Loan entity
        LoanProduct product = app.getLoanProduct();
        BigDecimal principal = app.getRequestedAmount();
        BigDecimal annualRate = product.getInterestRate();
        int tenure = app.getRequestedTenureMonths();

        BigDecimal emi = emiCalculatorService.calculateMonthlyEmi(principal, annualRate, tenure);
        BigDecimal totalRepayment = emi.multiply(BigDecimal.valueOf(tenure)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalInterest = totalRepayment.subtract(principal).setScale(2, RoundingMode.HALF_UP);

        String loanNumber = "LN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Loan loan = Loan.builder()
                .loanNumber(loanNumber)
                .applicationId(app.getId())
                .customerId(app.getCustomerId())
                .accountId(app.getAccountId())
                .accountNumber(app.getAccountNumber())
                .loanProductId(product.getId())
                .loanProductName(product.getName())
                .principalAmount(principal)
                .interestRate(annualRate)
                .tenureMonths(tenure)
                .emiAmount(emi)
                .totalRepaymentAmount(totalRepayment)
                .totalInterest(totalInterest)
                .outstandingAmount(totalRepayment)
                .status(LoanStatus.PENDING_DISBURSEMENT)
                .build();

        Loan savedLoan = loanRepository.save(loan);
        log.info("Loan record generated for application {}: Loan Number={}", app.getApplicationNumber(), savedLoan.getLoanNumber());

        return LoanResponse.from(savedLoan);
    }

    @Override
    @Transactional
    public LoanApplicationResponse rejectApplication(Long id, RejectionRequest request) {
        UserContext authUser = UserContextHolder.getContext();
        if (authUser == null || !authUser.isEmployee()) {
            log.warn("Non-employee user attempted to reject loan application ID {}", id);
            throw new LoanOwnershipViolationException("Access denied: Only loan officers (EMPLOYEE) can reject loan applications");
        }

        LoanApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with ID: " + id));

        if (app.getStatus() == ApplicationStatus.APPROVED) {
            throw new InvalidApplicationStateException("Cannot reject an application that has already been approved");
        }

        app.setStatus(ApplicationStatus.REJECTED);
        app.setRejectionReason(request != null && request.getReason() != null ? request.getReason() : "Application rejected by underwriting");
        LoanApplication saved = applicationRepository.save(app);

        log.info("Loan application rejected: ID={}, Reason={}", id, app.getRejectionReason());
        return LoanApplicationResponse.from(saved);
    }
}
