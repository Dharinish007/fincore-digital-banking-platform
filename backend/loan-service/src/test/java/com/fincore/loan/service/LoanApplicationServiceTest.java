package com.fincore.loan.service;

import com.fincore.loan.client.AccountClient;
import com.fincore.loan.client.CustomerClient;
import com.fincore.loan.dto.AccountResponse;
import com.fincore.loan.dto.ApprovalRequest;
import com.fincore.loan.dto.CreditAssessmentResponse;
import com.fincore.loan.dto.CustomerResponse;
import com.fincore.loan.dto.LoanApplicationRequest;
import com.fincore.loan.dto.LoanApplicationResponse;
import com.fincore.loan.dto.LoanResponse;
import com.fincore.loan.dto.RejectionRequest;
import com.fincore.loan.entity.CreditAssessment;
import com.fincore.loan.entity.Loan;
import com.fincore.loan.entity.LoanApplication;
import com.fincore.loan.entity.LoanProduct;
import com.fincore.loan.enums.*;
import com.fincore.loan.exception.EligibilityException;
import com.fincore.loan.exception.LoanOwnershipViolationException;
import com.fincore.loan.repository.CreditAssessmentRepository;
import com.fincore.loan.repository.LoanApplicationRepository;
import com.fincore.loan.repository.LoanProductRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoanApplicationServiceTest {

    @Mock
    private LoanApplicationRepository applicationRepository;

    @Mock
    private LoanProductRepository productRepository;

    @Mock
    private CreditAssessmentRepository assessmentRepository;

    @Mock
    private LoanRepository loanRepository;

    @Mock
    private CustomerClient customerClient;

    @Mock
    private AccountClient accountClient;

    @Mock
    private CreditAssessmentEngine creditAssessmentEngine;

    private EmiCalculatorService emiCalculatorService;
    private LoanApplicationServiceImpl applicationService;

    private LoanProduct activeProduct;

    @BeforeEach
    void setUp() {
        UserContextHolder.clear();
        emiCalculatorService = new EmiCalculatorService();
        applicationService = new LoanApplicationServiceImpl(
                applicationRepository,
                productRepository,
                assessmentRepository,
                loanRepository,
                customerClient,
                accountClient,
                creditAssessmentEngine,
                emiCalculatorService
        );

        activeProduct = LoanProduct.builder()
                .id(1L)
                .productCode("PERSONAL_01")
                .name("Standard Personal Loan")
                .loanType(LoanType.PERSONAL)
                .minAmount(new BigDecimal("1000.00"))
                .maxAmount(new BigDecimal("50000.00"))
                .interestRate(new BigDecimal("9.00"))
                .minTenureMonths(6)
                .maxTenureMonths(60)
                .status(LoanProductStatus.ACTIVE)
                .build();
    }

    @AfterEach
    void tearDown() {
        UserContextHolder.clear();
    }

    @Test
    @DisplayName("Should successfully submit valid loan application as authenticated customer")
    void testSubmitApplicationSuccess() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(10L)
                .username("john")
                .role("CUSTOMER")
                .customerId(9L)
                .build());

        LoanApplicationRequest request = LoanApplicationRequest.builder()
                .accountNumber("ACC-1001")
                .loanProductId(1L)
                .requestedAmount(new BigDecimal("10000.00"))
                .requestedTenureMonths(24)
                .purpose("Home renovation")
                .monthlyIncome(new BigDecimal("6000.00"))
                .monthlyExpenses(new BigDecimal("2000.00"))
                .build();

        CustomerResponse customer = CustomerResponse.builder()
                .id(9L)
                .status("ACTIVE")
                .kycStatus("VERIFIED")
                .build();

        AccountResponse account = AccountResponse.builder()
                .accountId(10L)
                .accountNumber("ACC-1001")
                .customerId(9L)
                .status("ACTIVE")
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(activeProduct));
        when(customerClient.getCustomerById(9L)).thenReturn(customer);
        when(accountClient.getAccountByNumber("ACC-1001")).thenReturn(account);
        when(applicationRepository.save(any(LoanApplication.class))).thenAnswer(invocation -> {
            LoanApplication saved = invocation.getArgument(0);
            saved.setId(101L);
            return saved;
        });

        LoanApplicationResponse response = applicationService.submitApplication(request);

        assertNotNull(response);
        assertEquals(ApplicationStatus.SUBMITTED, response.getStatus());
        assertEquals(new BigDecimal("10000.00"), response.getRequestedAmount());
        assertEquals("ACC-1001", response.getAccountNumber());
        assertEquals(9L, response.getCustomerId());
        verify(applicationRepository).save(any(LoanApplication.class));
    }

    @Test
    @DisplayName("Should reject application when customer attempts to submit with forged customerId")
    void testSubmitApplication_ForgedCustomerId_ThrowsOwnershipViolation() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(10L)
                .username("john")
                .role("CUSTOMER")
                .customerId(9L)
                .build());

        LoanApplicationRequest request = LoanApplicationRequest.builder()
                .customerId(8L) // Forged customer ID
                .accountNumber("ACC-1001")
                .loanProductId(1L)
                .requestedAmount(new BigDecimal("5000.00"))
                .requestedTenureMonths(12)
                .build();

        assertThrows(LoanOwnershipViolationException.class, () ->
                applicationService.submitApplication(request));
        verifyNoInteractions(productRepository);
    }

    @Test
    @DisplayName("Should reject application when requested amount exceeds product maximum")
    void testSubmitApplicationAmountExceeded() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(10L)
                .role("CUSTOMER")
                .customerId(9L)
                .build());

        LoanApplicationRequest request = LoanApplicationRequest.builder()
                .accountNumber("ACC-1001")
                .loanProductId(1L)
                .requestedAmount(new BigDecimal("100000.00")) // Exceeds max 50,000
                .requestedTenureMonths(24)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(activeProduct));

        EligibilityException ex = assertThrows(EligibilityException.class, () ->
                applicationService.submitApplication(request));

        assertTrue(ex.getMessage().contains("must be between"));
    }

    @Test
    @DisplayName("Should reject application when account does not belong to applicant customer")
    void testSubmitApplicationAccountMismatch() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(10L)
                .role("CUSTOMER")
                .customerId(9L)
                .build());

        LoanApplicationRequest request = LoanApplicationRequest.builder()
                .accountNumber("ACC-2002")
                .loanProductId(1L)
                .requestedAmount(new BigDecimal("5000.00"))
                .requestedTenureMonths(12)
                .build();

        CustomerResponse customer = CustomerResponse.builder().id(9L).status("ACTIVE").build();
        AccountResponse otherCustomerAccount = AccountResponse.builder()
                .accountId(20L)
                .accountNumber("ACC-2002")
                .customerId(8L) // Different customer ID
                .status("ACTIVE")
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(activeProduct));
        when(customerClient.getCustomerById(9L)).thenReturn(customer);
        when(accountClient.getAccountByNumber("ACC-2002")).thenReturn(otherCustomerAccount);

        LoanOwnershipViolationException ex = assertThrows(LoanOwnershipViolationException.class, () ->
                applicationService.submitApplication(request));

        assertTrue(ex.getMessage().contains("does not belong to customer"));
    }

    @Test
    @DisplayName("Should forbid customer from approving loan applications")
    void testCustomerApproveApplication_ThrowsOwnershipViolation() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(10L)
                .role("CUSTOMER")
                .customerId(9L)
                .build());

        assertThrows(LoanOwnershipViolationException.class, () ->
                applicationService.approveApplication(100L, ApprovalRequest.builder().build()));
    }

    @Test
    @DisplayName("Should forbid customer from rejecting loan applications")
    void testCustomerRejectApplication_ThrowsOwnershipViolation() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(10L)
                .role("CUSTOMER")
                .customerId(9L)
                .build());

        assertThrows(LoanOwnershipViolationException.class, () ->
                applicationService.rejectApplication(100L, RejectionRequest.builder().build()));
    }

    @Test
    @DisplayName("Should forbid customer from assessing loan applications")
    void testCustomerAssessApplication_ThrowsOwnershipViolation() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(10L)
                .role("CUSTOMER")
                .customerId(9L)
                .build());

        assertThrows(LoanOwnershipViolationException.class, () ->
                applicationService.assessApplication(100L));
    }

    @Test
    @DisplayName("Should forbid admin from assessing loan applications directly")
    void testAdminAssessApplication_ThrowsOwnershipViolation() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(1L)
                .role("ADMIN")
                .build());

        assertThrows(LoanOwnershipViolationException.class, () ->
                applicationService.assessApplication(100L));
    }

    @Test
    @DisplayName("Should allow employee to assess loan application")
    void testEmployeeAssessApplication_Success() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(2L)
                .role("EMPLOYEE")
                .employeeId(1L)
                .build());

        LoanApplication app = LoanApplication.builder()
                .id(100L)
                .applicationNumber("APP-100")
                .customerId(9L)
                .status(ApplicationStatus.SUBMITTED)
                .build();

        CreditAssessment ca = CreditAssessment.builder()
                .applicationId(100L)
                .creditScore(720)
                .decision(AssessmentDecision.APPROVED)
                .riskLevel(RiskLevel.LOW)
                .build();

        when(applicationRepository.findById(100L)).thenReturn(Optional.of(app));
        when(creditAssessmentEngine.assessApplication(app)).thenReturn(ca);
        when(assessmentRepository.findByApplicationId(100L)).thenReturn(Optional.empty());
        when(assessmentRepository.save(any(CreditAssessment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(applicationRepository.save(any(LoanApplication.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CreditAssessmentResponse resp = applicationService.assessApplication(100L);

        assertNotNull(resp);
        assertEquals(720, resp.getCreditScore());
        assertEquals(ApplicationStatus.CREDIT_ASSESSED, app.getStatus());
        verify(applicationRepository).save(app);
    }

    @Test
    @DisplayName("Should forbid customer from viewing another customer's application")
    void testCustomerGetApplicationById_OtherCustomer_ThrowsOwnershipViolation() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(10L)
                .role("CUSTOMER")
                .customerId(9L)
                .build());

        LoanApplication otherApp = LoanApplication.builder()
                .id(100L)
                .applicationNumber("APP-100")
                .customerId(8L) // Other customer
                .build();

        when(applicationRepository.findById(100L)).thenReturn(Optional.of(otherApp));

        assertThrows(LoanOwnershipViolationException.class, () ->
                applicationService.getApplicationById(100L));
    }

    @Test
    @DisplayName("Should approve application with valid assessment and generate Loan when called by Employee")
    void testApproveApplicationSuccess() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(2L)
                .username("sarah_employee")
                .role("EMPLOYEE")
                .employeeId(1L)
                .build());

        LoanApplication app = LoanApplication.builder()
                .id(100L)
                .applicationNumber("APP-100")
                .customerId(9L)
                .accountId(10L)
                .accountNumber("ACC-1001")
                .loanProduct(activeProduct)
                .requestedAmount(new BigDecimal("12000.00"))
                .requestedTenureMonths(12)
                .status(ApplicationStatus.CREDIT_ASSESSED)
                .build();

        CreditAssessment assessment = CreditAssessment.builder()
                .id(50L)
                .applicationId(100L)
                .creditScore(750)
                .riskLevel(RiskLevel.LOW)
                .decision(AssessmentDecision.APPROVED)
                .build();

        when(applicationRepository.findById(100L)).thenReturn(Optional.of(app));
        when(assessmentRepository.findByApplicationId(100L)).thenReturn(Optional.of(assessment));
        when(loanRepository.save(any(Loan.class))).thenAnswer(invocation -> {
            Loan l = invocation.getArgument(0);
            l.setId(500L);
            return l;
        });

        LoanResponse response = applicationService.approveApplication(100L, ApprovalRequest.builder().officerNotes("Approved").build());

        assertNotNull(response);
        assertEquals(LoanStatus.PENDING_DISBURSEMENT, response.getStatus());
        assertEquals(new BigDecimal("12000.00"), response.getPrincipalAmount());
        assertEquals(app.getAccountNumber(), response.getAccountNumber());
        assertEquals(ApplicationStatus.APPROVED, app.getStatus());
        verify(loanRepository).save(any(Loan.class));
    }

    @Test
    @DisplayName("Should reject application with reason when called by Employee")
    void testRejectApplicationSuccess() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(2L)
                .role("EMPLOYEE")
                .employeeId(1L)
                .build());

        LoanApplication app = LoanApplication.builder()
                .id(100L)
                .applicationNumber("APP-100")
                .status(ApplicationStatus.SUBMITTED)
                .build();

        when(applicationRepository.findById(100L)).thenReturn(Optional.of(app));
        when(applicationRepository.save(any(LoanApplication.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LoanApplicationResponse response = applicationService.rejectApplication(
                100L, RejectionRequest.builder().reason("High debt exposure").build()
        );

        assertNotNull(response);
        assertEquals(ApplicationStatus.REJECTED, response.getStatus());
        assertEquals("High debt exposure", response.getRejectionReason());
    }
}
