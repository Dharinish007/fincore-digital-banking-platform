package com.fincore.loan;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fincore.loan.client.AccountClient;
import com.fincore.loan.client.CustomerClient;
import com.fincore.loan.client.TransactionClient;
import com.fincore.loan.dto.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import javax.crypto.SecretKey;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class LoanControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CustomerClient customerClient;

    @MockBean
    private AccountClient accountClient;

    @MockBean
    private TransactionClient transactionClient;

    private String generateToken(Long userId, String username, String role, Long customerId, Long employeeId) {
        SecretKey key = Keys.hmacShaKeyFor("FinCoreDigitalBankingPlatformSecureJwtSecretKey2026WithSufficientBitsForHmacSha256".getBytes(StandardCharsets.UTF_8));
        List<String> authorities = "CUSTOMER".equalsIgnoreCase(role)
                ? List.of("LOAN_APPLY", "LOAN_VIEW_OWN")
                : "EMPLOYEE".equalsIgnoreCase(role)
                ? List.of("LOAN_VIEW", "LOAN_VIEW_ALL", "LOAN_REVIEW", "LOAN_ASSESS", "LOAN_APPROVE", "LOAN_REJECT", "LOAN_DISBURSE")
                : List.of("LOAN_PRODUCT_MANAGE");

        return Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .claim("role", role)
                .claim("customerId", customerId)
                .claim("employeeId", employeeId)
                .claim("authorities", authorities)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(key)
                .compact();
    }

    @Test
    @DisplayName("Complete end-to-end integration flow: Products -> Submit Application -> Assess -> Approve -> Disburse")
    void testEndToEndLoanFlow() throws Exception {
        String customerToken = generateToken(10L, "john", "CUSTOMER", 1001L, null);
        String employeeToken = generateToken(2L, "sarah_employee", "EMPLOYEE", null, 1L);

        // 1. Get Seeding Products
        mockMvc.perform(get("/api/v1/loan-products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());

        // 2. Setup Downstream Client Mocks
        CustomerResponse customer = CustomerResponse.builder()
                .id(1001L)
                .customerNumber("CUST-1001")
                .firstName("Alice")
                .lastName("Smith")
                .status("ACTIVE")
                .kycStatus("VERIFIED")
                .build();

        AccountResponse account = AccountResponse.builder()
                .accountId(2001L)
                .accountNumber("ACC-2001")
                .customerId(1001L)
                .status("ACTIVE")
                .balance(new BigDecimal("5000.00"))
                .build();

        when(customerClient.getCustomerById(1001L)).thenReturn(customer);
        when(accountClient.getAccountByNumber("ACC-2001")).thenReturn(account);
        when(accountClient.getAccountById(2001L)).thenReturn(account);
        when(transactionClient.getTransactionsByAccountNumber("ACC-2001")).thenReturn(List.of(
                TransactionResponse.builder().type("DEPOSIT").amount(new BigDecimal("4000.00")).build()
        ));
        when(accountClient.credit(anyString(), any(BigDecimal.class))).thenReturn(account);
        when(transactionClient.recordDisbursementTransaction(anyString(), any(BigDecimal.class), anyString()))
                .thenReturn(TransactionResponse.builder().type("DEPOSIT").build());

        // 3. Submit Loan Application as Customer
        LoanApplicationRequest appReq = LoanApplicationRequest.builder()
                .accountNumber("ACC-2001")
                .loanProductId(1L)
                .requestedAmount(new BigDecimal("10000.00"))
                .requestedTenureMonths(12)
                .purpose("Equipment Upgrade")
                .monthlyIncome(new BigDecimal("6000.00"))
                .monthlyExpenses(new BigDecimal("2000.00"))
                .build();

        String submitResult = mockMvc.perform(post("/api/v1/loan-applications")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("SUBMITTED"))
                .andExpect(jsonPath("$.data.customerId").value(1001))
                .andReturn().getResponse().getContentAsString();

        Long appId = objectMapper.readTree(submitResult).get("data").get("id").asLong();

        // 4. Run Credit Assessment
        mockMvc.perform(post("/api/v1/loan-applications/" + appId + "/credit-assessment")
                        .header("Authorization", "Bearer " + employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.creditScore").isNumber())
                .andExpect(jsonPath("$.data.riskLevel").value("LOW"))
                .andExpect(jsonPath("$.data.decision").value("APPROVED"));

        // 5. Customer attempts to approve -> Expect 403 FORBIDDEN
        ApprovalRequest approvalReq = ApprovalRequest.builder().officerNotes("Approved under prime tier").build();
        mockMvc.perform(post("/api/v1/loan-applications/" + appId + "/approve")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(approvalReq)))
                .andExpect(status().isForbidden());

        // 6. Employee Approves Application & Generates Loan -> 200 OK
        String approveResult = mockMvc.perform(post("/api/v1/loan-applications/" + appId + "/approve")
                        .header("Authorization", "Bearer " + employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(approvalReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PENDING_DISBURSEMENT"))
                .andReturn().getResponse().getContentAsString();

        Long loanId = objectMapper.readTree(approveResult).get("data").get("id").asLong();

        // 7. View Repayment Schedule as Customer
        mockMvc.perform(get("/api/v1/loans/" + loanId + "/repayment-schedule")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.schedule").isArray());

        // 8. Customer attempts to disburse -> Expect 403 FORBIDDEN
        mockMvc.perform(post("/api/v1/loans/" + loanId + "/disburse")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // 9. Employee Disburses Loan -> 200 OK
        mockMvc.perform(post("/api/v1/loans/" + loanId + "/disburse")
                        .header("Authorization", "Bearer " + employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                .andExpect(jsonPath("$.data.disbursedAt").isNotEmpty());

        // 10. Verify Statistics
        mockMvc.perform(get("/api/v1/loans/statistics")
                        .header("Authorization", "Bearer " + employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalLoans").value(1))
                .andExpect(jsonPath("$.data.activeLoans").value(1));
    }

    @Test
    @DisplayName("EMI preview calculator endpoint test")
    void testEmiPreviewEndpoint() throws Exception {
        EmiCalculationRequest calcReq = EmiCalculationRequest.builder()
                .principalAmount(new BigDecimal("20000.00"))
                .annualInterestRate(new BigDecimal("10.00"))
                .tenureMonths(24)
                .build();

        mockMvc.perform(post("/api/v1/loans/calculate-emi")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(calcReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.monthlyEmi").isNumber())
                .andExpect(jsonPath("$.data.totalInterest").isNumber());
    }
}
