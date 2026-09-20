package com.fincore.loan.service;

import com.fincore.loan.client.AccountClient;
import com.fincore.loan.client.TransactionClient;
import com.fincore.loan.dto.AccountResponse;
import com.fincore.loan.dto.LoanResponse;
import com.fincore.loan.dto.LoanStatisticsResponse;
import com.fincore.loan.dto.RepaymentScheduleItem;
import com.fincore.loan.dto.RepaymentScheduleResponse;
import com.fincore.loan.entity.Loan;
import com.fincore.loan.enums.ApplicationStatus;
import com.fincore.loan.enums.LoanStatus;
import com.fincore.loan.exception.DisbursementException;
import com.fincore.loan.exception.InvalidLoanStateException;
import com.fincore.loan.exception.ResourceNotFoundException;
import com.fincore.loan.repository.LoanApplicationRepository;
import com.fincore.loan.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final LoanApplicationRepository applicationRepository;
    private final AccountClient accountClient;
    private final TransactionClient transactionClient;
    private final EmiCalculatorService emiCalculatorService;

    @Override
    @Transactional(readOnly = true)
    public LoanResponse getLoanById(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found with ID: " + id));

        com.fincore.loan.security.UserContext authUser = com.fincore.loan.security.UserContextHolder.getContext();
        if (authUser == null) {
            throw new com.fincore.loan.exception.LoanOwnershipViolationException("Access denied: Authentication required");
        }
        if (authUser.isCustomer()) {
            if (authUser.getCustomerId() == null || !loan.getCustomerId().equals(authUser.getCustomerId())) {
                log.warn("Customer {} attempted unauthorized access to loan ID {}", authUser.getCustomerId(), id);
                throw new com.fincore.loan.exception.LoanOwnershipViolationException("Access denied: You do not have permission to view this loan");
            }
        }

        return LoanResponse.from(loan);
    }

    @Override
    @Transactional(readOnly = true)
    public LoanResponse getLoanByNumber(String loanNumber) {
        Loan loan = loanRepository.findByLoanNumber(loanNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found with loan number: " + loanNumber));

        com.fincore.loan.security.UserContext authUser = com.fincore.loan.security.UserContextHolder.getContext();
        if (authUser == null) {
            throw new com.fincore.loan.exception.LoanOwnershipViolationException("Access denied: Authentication required");
        }
        if (authUser.isCustomer()) {
            if (authUser.getCustomerId() == null || !loan.getCustomerId().equals(authUser.getCustomerId())) {
                log.warn("Customer {} attempted unauthorized access to loan number {}", authUser.getCustomerId(), loanNumber);
                throw new com.fincore.loan.exception.LoanOwnershipViolationException("Access denied: You do not have permission to view this loan");
            }
        }

        return LoanResponse.from(loan);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LoanResponse> getLoansByCustomerId(Long customerId, Pageable pageable) {
        com.fincore.loan.security.UserContext authUser = com.fincore.loan.security.UserContextHolder.getContext();
        if (authUser == null) {
            throw new com.fincore.loan.exception.LoanOwnershipViolationException("Access denied: Authentication required");
        }
        if (authUser.isCustomer()) {
            if (authUser.getCustomerId() == null || !customerId.equals(authUser.getCustomerId())) {
                log.warn("Customer {} attempted unauthorized access to loans for customer {}", authUser.getCustomerId(), customerId);
                throw new com.fincore.loan.exception.LoanOwnershipViolationException(String.format(
                        "Access denied: Cannot view loans for customer ID %d", customerId));
            }
        }

        return loanRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable)
                .map(LoanResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LoanResponse> getAllLoans(Long customerId, LoanStatus status, Pageable pageable) {
        com.fincore.loan.security.UserContext authUser = com.fincore.loan.security.UserContextHolder.getContext();
        if (authUser == null) {
            throw new com.fincore.loan.exception.LoanOwnershipViolationException("Access denied: Authentication required");
        }

        final Long effectiveCustomerId;
        if (authUser.isCustomer()) {
            if (authUser.getCustomerId() == null) {
                throw new com.fincore.loan.exception.LoanOwnershipViolationException("Access denied: Customer identity not found in security context");
            }
            if (customerId != null && !customerId.equals(authUser.getCustomerId())) {
                throw new com.fincore.loan.exception.LoanOwnershipViolationException("Access denied: You cannot view loans of another customer");
            }
            effectiveCustomerId = authUser.getCustomerId();
        } else {
            effectiveCustomerId = customerId;
        }

        if (effectiveCustomerId != null && status != null) {
            return loanRepository.findAll((root, query, cb) ->
                    cb.and(cb.equal(root.get("customerId"), effectiveCustomerId), cb.equal(root.get("status"), status)), pageable)
                    .map(LoanResponse::from);
        } else if (effectiveCustomerId != null) {
            return loanRepository.findByCustomerIdOrderByCreatedAtDesc(effectiveCustomerId, pageable)
                    .map(LoanResponse::from);
        } else if (status != null) {
            return loanRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                    .map(LoanResponse::from);
        } else {
            return loanRepository.findAll(pageable).map(LoanResponse::from);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public RepaymentScheduleResponse getRepaymentSchedule(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found with ID: " + id));

        com.fincore.loan.security.UserContext authUser = com.fincore.loan.security.UserContextHolder.getContext();
        if (authUser == null) {
            throw new com.fincore.loan.exception.LoanOwnershipViolationException("Access denied: Authentication required");
        }
        if (authUser.isCustomer()) {
            if (authUser.getCustomerId() == null || !loan.getCustomerId().equals(authUser.getCustomerId())) {
                throw new com.fincore.loan.exception.LoanOwnershipViolationException("Access denied: You do not have permission to view this repayment schedule");
            }
        }

        LocalDate startDate = loan.getStartDate() != null ? loan.getStartDate() : LocalDate.now();
        List<RepaymentScheduleItem> schedule = emiCalculatorService.generateSchedule(
                loan.getPrincipalAmount(),
                loan.getInterestRate(),
                loan.getTenureMonths(),
                startDate
        );

        return RepaymentScheduleResponse.builder()
                .loanNumber(loan.getLoanNumber())
                .principalAmount(loan.getPrincipalAmount())
                .interestRate(loan.getInterestRate())
                .tenureMonths(loan.getTenureMonths())
                .monthlyEmi(loan.getEmiAmount())
                .totalInterest(loan.getTotalInterest())
                .totalRepaymentAmount(loan.getTotalRepaymentAmount())
                .schedule(schedule)
                .build();
    }

    @Override
    @Transactional
    public LoanResponse disburseLoan(Long id) {
        com.fincore.loan.security.UserContext authUser = com.fincore.loan.security.UserContextHolder.getContext();
        if (authUser == null || !authUser.isEmployee()) {
            log.warn("Non-employee user attempted to disburse loan ID {}", id);
            throw new com.fincore.loan.exception.LoanOwnershipViolationException("Access denied: Only loan officers (EMPLOYEE) can disburse loans");
        }

        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found with ID: " + id));

        // State Machine validation
        if (loan.getStatus() == LoanStatus.ACTIVE) {
            throw new InvalidLoanStateException("Loan is already disbursed and active (Loan: " + loan.getLoanNumber() + ")");
        }
        if (loan.getStatus() != LoanStatus.PENDING_DISBURSEMENT) {
            throw new InvalidLoanStateException("Cannot disburse loan in status: " + loan.getStatus());
        }

        log.info("Initiating loan disbursement for Loan {}: Amount=${} to Account={}",
                loan.getLoanNumber(), loan.getPrincipalAmount(), loan.getAccountNumber());

        // 1. Verify disbursement account status in AccountService
        AccountResponse account = accountClient.getAccountByNumber(loan.getAccountNumber());
        if (account == null) {
            throw new DisbursementException("Disbursement account not found: " + loan.getAccountNumber());
        }
        if (account.getStatus() != null && !"ACTIVE".equalsIgnoreCase(account.getStatus())) {
            throw new DisbursementException("Disbursement account is not active (Status: " + account.getStatus() + ")");
        }

        // 2. Perform credit and record transaction in TransactionService audit ledger
        try {
            transactionClient.recordDisbursementTransaction(loan.getAccountNumber(), loan.getPrincipalAmount(), loan.getLoanNumber());
            log.info("Successfully credited principal amount and recorded disbursement transaction for loan {}", loan.getLoanNumber());
        } catch (Exception e) {
            log.warn("Transaction service disbursement recording encountered an error, falling back to direct account credit: {}", e.getMessage());
            try {
                accountClient.credit(loan.getAccountNumber(), loan.getPrincipalAmount());
                log.info("Successfully credited principal amount directly to account {}", loan.getAccountNumber());
            } catch (Exception ex) {
                log.error("Account credit failed during disbursement of loan {}", loan.getLoanNumber(), ex);
                throw new DisbursementException("Failed to credit funds to account: " + ex.getMessage(), ex);
            }
        }

        // 3. Update Loan entity state
        LocalDate now = LocalDate.now();
        loan.setStatus(LoanStatus.ACTIVE);
        loan.setDisbursedAt(LocalDateTime.now());
        loan.setStartDate(now);
        loan.setEndDate(now.plusMonths(loan.getTenureMonths()));

        Loan updatedLoan = loanRepository.save(loan);
        log.info("Loan disbursement complete. Loan {} is now ACTIVE", updatedLoan.getLoanNumber());

        return LoanResponse.from(updatedLoan);
    }

    @Override
    @Transactional(readOnly = true)
    public LoanStatisticsResponse getStatistics() {
        long totalApps = applicationRepository.count();
        long pendingApps = applicationRepository.countByStatus(ApplicationStatus.SUBMITTED)
                + applicationRepository.countByStatus(ApplicationStatus.UNDER_REVIEW)
                + applicationRepository.countByStatus(ApplicationStatus.CREDIT_ASSESSED);
        long approvedApps = applicationRepository.countByStatus(ApplicationStatus.APPROVED);
        long rejectedApps = applicationRepository.countByStatus(ApplicationStatus.REJECTED);

        long totalLoans = loanRepository.count();
        long activeLoans = loanRepository.countByStatus(LoanStatus.ACTIVE);
        long pendingDisb = loanRepository.countByStatus(LoanStatus.PENDING_DISBURSEMENT);

        BigDecimal totalDisbursed = loanRepository.sumDisbursedAmount();
        BigDecimal totalOutstanding = loanRepository.sumActiveOutstandingAmount();

        return LoanStatisticsResponse.builder()
                .totalApplications(totalApps)
                .pendingApplications(pendingApps)
                .approvedApplications(approvedApps)
                .rejectedApplications(rejectedApps)
                .totalLoans(totalLoans)
                .activeLoans(activeLoans)
                .pendingDisbursementLoans(pendingDisb)
                .totalDisbursedAmount(totalDisbursed)
                .totalActiveOutstandingAmount(totalOutstanding)
                .build();
    }
}
