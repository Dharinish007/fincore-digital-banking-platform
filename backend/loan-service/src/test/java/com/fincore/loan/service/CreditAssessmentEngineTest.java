package com.fincore.loan.service;

import com.fincore.loan.client.AccountClient;
import com.fincore.loan.client.CustomerClient;
import com.fincore.loan.client.TransactionClient;
import com.fincore.loan.dto.AccountResponse;
import com.fincore.loan.dto.CustomerResponse;
import com.fincore.loan.dto.TransactionResponse;
import com.fincore.loan.entity.CreditAssessment;
import com.fincore.loan.entity.LoanApplication;
import com.fincore.loan.entity.LoanProduct;
import com.fincore.loan.enums.AssessmentDecision;
import com.fincore.loan.enums.LoanType;
import com.fincore.loan.enums.RiskLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CreditAssessmentEngineTest {

    @Mock
    private CustomerClient customerClient;

    @Mock
    private AccountClient accountClient;

    @Mock
    private TransactionClient transactionClient;

    private EmiCalculatorService emiCalculatorService;
    private CreditAssessmentEngine assessmentEngine;

    private LoanProduct sampleProduct;
    private LoanApplication sampleApplication;

    @BeforeEach
    void setUp() {
        emiCalculatorService = new EmiCalculatorService();
        assessmentEngine = new CreditAssessmentEngine(customerClient, accountClient, transactionClient, emiCalculatorService);

        sampleProduct = LoanProduct.builder()
                .id(1L)
                .name("Personal Loan")
                .loanType(LoanType.PERSONAL)
                .minAmount(new BigDecimal("1000.00"))
                .maxAmount(new BigDecimal("50000.00"))
                .interestRate(new BigDecimal("8.50"))
                .minTenureMonths(6)
                .maxTenureMonths(36)
                .build();

        sampleApplication = LoanApplication.builder()
                .id(100L)
                .applicationNumber("APP-TEST-001")
                .customerId(1L)
                .accountNumber("ACC-1001")
                .loanProduct(sampleProduct)
                .requestedAmount(new BigDecimal("10000.00"))
                .requestedTenureMonths(12)
                .monthlyIncome(new BigDecimal("5000.00"))
                .monthlyExpenses(new BigDecimal("1500.00"))
                .build();
    }

    @Test
    @DisplayName("Should approve low-risk applicant with verified KYC, healthy cash flow, and low DTI")
    void testLowRiskApproval() {
        CustomerResponse customer = CustomerResponse.builder()
                .id(1L)
                .kycStatus("VERIFIED")
                .status("ACTIVE")
                .build();

        AccountResponse account = AccountResponse.builder()
                .accountId(1L)
                .accountNumber("ACC-1001")
                .customerId(1L)
                .status("ACTIVE")
                .balance(new BigDecimal("4000.00")) // 40% of loan amount
                .build();

        List<TransactionResponse> txList = List.of(
                TransactionResponse.builder().type("DEPOSIT").amount(new BigDecimal("3000.00")).build(),
                TransactionResponse.builder().type("DEPOSIT").amount(new BigDecimal("3500.00")).build(),
                TransactionResponse.builder().type("WITHDRAWAL").amount(new BigDecimal("1200.00")).build()
        );

        when(customerClient.getCustomerById(anyLong())).thenReturn(customer);
        when(accountClient.getAccountByNumber(anyString())).thenReturn(account);
        when(transactionClient.getTransactionsByAccountNumber(anyString())).thenReturn(txList);

        CreditAssessment assessment = assessmentEngine.assessApplication(sampleApplication);

        assertNotNull(assessment);
        assertTrue(assessment.getCreditScore() >= 700, "Score should be >= 700, actual: " + assessment.getCreditScore());
        assertEquals(RiskLevel.LOW, assessment.getRiskLevel());
        assertEquals(AssessmentDecision.APPROVED, assessment.getDecision());
        assertTrue(assessment.getMaxEligibleAmount().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Should reject high-risk applicant with rejected KYC")
    void testRejectedKycAutoReject() {
        CustomerResponse customer = CustomerResponse.builder()
                .id(1L)
                .kycStatus("REJECTED")
                .status("ACTIVE")
                .build();

        AccountResponse account = AccountResponse.builder()
                .accountId(1L)
                .accountNumber("ACC-1001")
                .customerId(1L)
                .status("ACTIVE")
                .balance(new BigDecimal("100.00"))
                .build();

        when(customerClient.getCustomerById(anyLong())).thenReturn(customer);
        when(accountClient.getAccountByNumber(anyString())).thenReturn(account);
        when(transactionClient.getTransactionsByAccountNumber(anyString())).thenReturn(List.of());

        CreditAssessment assessment = assessmentEngine.assessApplication(sampleApplication);

        assertNotNull(assessment);
        assertEquals(RiskLevel.HIGH, assessment.getRiskLevel());
        assertEquals(AssessmentDecision.REJECTED, assessment.getDecision());
        assertTrue(assessment.getAssessmentSummary().contains("KYC verification failed"));
    }

    @Test
    @DisplayName("Should flag manual review for moderate DTI or pending KYC")
    void testModerateRiskManualReview() {
        CustomerResponse customer = CustomerResponse.builder()
                .id(1L)
                .kycStatus("PENDING")
                .status("ACTIVE")
                .build();

        AccountResponse account = AccountResponse.builder()
                .accountId(1L)
                .accountNumber("ACC-1001")
                .customerId(1L)
                .status("ACTIVE")
                .balance(new BigDecimal("500.00"))
                .build();

        when(customerClient.getCustomerById(anyLong())).thenReturn(customer);
        when(accountClient.getAccountByNumber(anyString())).thenReturn(account);
        when(transactionClient.getTransactionsByAccountNumber(anyString())).thenReturn(List.of());

        CreditAssessment assessment = assessmentEngine.assessApplication(sampleApplication);

        assertNotNull(assessment);
        assertEquals(RiskLevel.MEDIUM, assessment.getRiskLevel());
        assertEquals(AssessmentDecision.MANUAL_REVIEW, assessment.getDecision());
    }
}
