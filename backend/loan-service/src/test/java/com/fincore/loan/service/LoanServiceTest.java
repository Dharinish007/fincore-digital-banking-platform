package com.fincore.loan.service;

import com.fincore.loan.client.AccountClient;
import com.fincore.loan.client.TransactionClient;
import com.fincore.loan.dto.AccountResponse;
import com.fincore.loan.dto.LoanResponse;
import com.fincore.loan.dto.RepaymentScheduleResponse;
import com.fincore.loan.dto.TransactionResponse;
import com.fincore.loan.entity.Loan;
import com.fincore.loan.enums.LoanStatus;
import com.fincore.loan.exception.DisbursementException;
import com.fincore.loan.exception.InvalidLoanStateException;
import com.fincore.loan.exception.LoanOwnershipViolationException;
import com.fincore.loan.repository.LoanApplicationRepository;
import com.fincore.loan.repository.LoanRepository;
import com.fincore.loan.security.UserContext;
import com.fincore.loan.security.UserContextHolder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoanServiceTest {

    @Mock
    private LoanRepository loanRepository;

    @Mock
    private LoanApplicationRepository applicationRepository;

    @Mock
    private AccountClient accountClient;

    @Mock
    private TransactionClient transactionClient;

    private EmiCalculatorService emiCalculatorService;
    private LoanServiceImpl loanService;

    private Loan pendingLoan;

    @BeforeEach
    void setUp() {
        UserContextHolder.clear();
        emiCalculatorService = new EmiCalculatorService();
        loanService = new LoanServiceImpl(
                loanRepository,
                applicationRepository,
                accountClient,
                transactionClient,
                emiCalculatorService
        );

        pendingLoan = Loan.builder()
                .id(200L)
                .loanNumber("LN-TEST-001")
                .applicationId(100L)
                .customerId(9L)
                .accountId(10L)
                .accountNumber("ACC-1001")
                .loanProductId(1L)
                .loanProductName("Personal Loan")
                .principalAmount(new BigDecimal("15000.00"))
                .interestRate(new BigDecimal("8.00"))
                .tenureMonths(12)
                .emiAmount(new BigDecimal("1304.88"))
                .totalRepaymentAmount(new BigDecimal("15658.56"))
                .totalInterest(new BigDecimal("658.56"))
                .outstandingAmount(new BigDecimal("15658.56"))
                .status(LoanStatus.PENDING_DISBURSEMENT)
                .build();
    }

    @AfterEach
    void tearDown() {
        UserContextHolder.clear();
    }

    @Test
    @DisplayName("Should successfully disburse funds and transition loan status to ACTIVE when called by Employee")
    void testDisburseLoanSuccess() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(2L)
                .username("sarah_employee")
                .role("EMPLOYEE")
                .employeeId(1L)
                .build());

        AccountResponse activeAccount = AccountResponse.builder()
                .accountId(10L)
                .accountNumber("ACC-1001")
                .status("ACTIVE")
                .balance(new BigDecimal("1000.00"))
                .build();

        when(loanRepository.findById(200L)).thenReturn(Optional.of(pendingLoan));
        when(accountClient.getAccountByNumber("ACC-1001")).thenReturn(activeAccount);
        when(transactionClient.recordDisbursementTransaction(anyString(), any(BigDecimal.class), anyString()))
                .thenReturn(TransactionResponse.builder().type("DEPOSIT").build());
        when(loanRepository.save(any(Loan.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LoanResponse response = loanService.disburseLoan(200L);

        assertNotNull(response);
        assertEquals(LoanStatus.ACTIVE, response.getStatus());
        assertNotNull(response.getDisbursedAt());
        assertNotNull(response.getStartDate());
        assertNotNull(response.getEndDate());

        verify(transactionClient).recordDisbursementTransaction(eq("ACC-1001"), eq(new BigDecimal("15000.00")), eq("LN-TEST-001"));
        verify(loanRepository).save(pendingLoan);
    }

    @Test
    @DisplayName("Should forbid customer from disbursing loans")
    void testCustomerDisburseLoan_ThrowsOwnershipViolation() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(10L)
                .role("CUSTOMER")
                .customerId(9L)
                .build());

        assertThrows(LoanOwnershipViolationException.class, () ->
                loanService.disburseLoan(200L));
        verifyNoInteractions(loanRepository);
    }

    @Test
    @DisplayName("Should forbid admin from disbursing loans directly")
    void testAdminDisburseLoan_ThrowsOwnershipViolation() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(1L)
                .username("admin")
                .role("ADMIN")
                .build());

        assertThrows(LoanOwnershipViolationException.class, () ->
                loanService.disburseLoan(200L));
        verifyNoInteractions(loanRepository);
    }

    @Test
    @DisplayName("Should forbid customer from querying loans for another customer")
    void testCustomerAttemptGetAllLoansForOtherCustomer_ThrowsOwnershipViolation() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(10L)
                .role("CUSTOMER")
                .customerId(9L)
                .build());

        assertThrows(LoanOwnershipViolationException.class, () ->
                loanService.getAllLoans(8L, null, org.springframework.data.domain.Pageable.unpaged()));
    }

    @Test
    @DisplayName("Should forbid customer from viewing another customer's loan")
    void testCustomerGetLoanById_OtherCustomer_ThrowsOwnershipViolation() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(10L)
                .role("CUSTOMER")
                .customerId(9L)
                .build());

        Loan otherLoan = Loan.builder()
                .id(201L)
                .customerId(8L) // Other customer
                .loanNumber("LN-OTHER-001")
                .build();

        when(loanRepository.findById(201L)).thenReturn(Optional.of(otherLoan));

        assertThrows(LoanOwnershipViolationException.class, () ->
                loanService.getLoanById(201L));
    }

    @Test
    @DisplayName("Should prevent double disbursement on already active loan")
    void testDoubleDisbursementPrevention() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(2L)
                .username("sarah_employee")
                .role("EMPLOYEE")
                .employeeId(1L)
                .build());

        pendingLoan.setStatus(LoanStatus.ACTIVE);
        when(loanRepository.findById(200L)).thenReturn(Optional.of(pendingLoan));

        assertThrows(InvalidLoanStateException.class, () -> loanService.disburseLoan(200L));
        verifyNoInteractions(accountClient);
    }

    @Test
    @DisplayName("Should abort disbursement if disbursement account is inactive")
    void testDisbursementInactiveAccount() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(2L)
                .username("sarah_employee")
                .role("EMPLOYEE")
                .employeeId(1L)
                .build());

        AccountResponse inactiveAccount = AccountResponse.builder()
                .accountId(10L)
                .accountNumber("ACC-1001")
                .status("SUSPENDED")
                .build();

        when(loanRepository.findById(200L)).thenReturn(Optional.of(pendingLoan));
        when(accountClient.getAccountByNumber("ACC-1001")).thenReturn(inactiveAccount);

        assertThrows(DisbursementException.class, () -> loanService.disburseLoan(200L));
        verify(accountClient, never()).credit(anyString(), any(BigDecimal.class));
    }

    @Test
    @DisplayName("Should return accurate repayment schedule for loan")
    void testGetRepaymentSchedule() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(10L)
                .username("john")
                .role("CUSTOMER")
                .customerId(9L)
                .build());

        when(loanRepository.findById(200L)).thenReturn(Optional.of(pendingLoan));

        RepaymentScheduleResponse scheduleResp = loanService.getRepaymentSchedule(200L);

        assertNotNull(scheduleResp);
        assertEquals("LN-TEST-001", scheduleResp.getLoanNumber());
        assertEquals(12, scheduleResp.getSchedule().size());
        assertEquals(new BigDecimal("15000.00"), scheduleResp.getPrincipalAmount());
    }
}
