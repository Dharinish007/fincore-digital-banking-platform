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
import com.fincore.loan.enums.RiskLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CreditAssessmentEngine {

    private final CustomerClient customerClient;
    private final AccountClient accountClient;
    private final TransactionClient transactionClient;
    private final EmiCalculatorService emiCalculatorService;

    /**
     * Executes deterministic, rule-based credit scoring (300 - 850 scale) and risk assessment.
     */
    public CreditAssessment assessApplication(LoanApplication application) {
        log.info("Running credit assessment for application: {}", application.getApplicationNumber());

        LoanProduct product = application.getLoanProduct();
        Long customerId = application.getCustomerId();
        String accountNumber = application.getAccountNumber();

        // 1. Fetch real customer, account, and transaction data
        CustomerResponse customer = customerClient.getCustomerById(customerId);
        AccountResponse account = (accountNumber != null)
                ? accountClient.getAccountByNumber(accountNumber)
                : (application.getAccountId() != null ? accountClient.getAccountById(application.getAccountId()) : null);

        List<TransactionResponse> transactions = (accountNumber != null)
                ? transactionClient.getTransactionsByAccountNumber(accountNumber)
                : transactionClient.getTransactionsByCustomerId(customerId);

        // 2. Compute financial baselines
        BigDecimal requestedAmount = application.getRequestedAmount();
        int tenureMonths = application.getRequestedTenureMonths();
        BigDecimal annualRate = product.getInterestRate();

        BigDecimal proposedEmi = emiCalculatorService.calculateMonthlyEmi(requestedAmount, annualRate, tenureMonths);

        // Monthly Income Resolution
        BigDecimal monthlyIncome = application.getMonthlyIncome();
        if (monthlyIncome == null || monthlyIncome.compareTo(BigDecimal.ZERO) <= 0) {
            monthlyIncome = calculateMonthlyIncomeFromTransactions(transactions);
            if (monthlyIncome.compareTo(BigDecimal.ZERO) <= 0) {
                monthlyIncome = BigDecimal.valueOf(3500.00); // Baseline default
            }
        }

        // Monthly Expenses Resolution
        BigDecimal monthlyExpenses = application.getMonthlyExpenses();
        if (monthlyExpenses == null || monthlyExpenses.compareTo(BigDecimal.ZERO) < 0) {
            monthlyExpenses = monthlyIncome.multiply(BigDecimal.valueOf(0.40)).setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal existingMonthlyDebt = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        // Debt-to-Income (DTI) Calculation
        BigDecimal totalMonthlyObligations = proposedEmi.add(existingMonthlyDebt);
        BigDecimal dtiRatio = (monthlyIncome.compareTo(BigDecimal.ZERO) > 0)
                ? totalMonthlyObligations.divide(monthlyIncome, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.valueOf(100.00);

        // Net Disposable Income
        BigDecimal netDisposableIncome = monthlyIncome.subtract(monthlyExpenses).subtract(existingMonthlyDebt);

        // 3. Score Factors (300 Base + up to 550 factor points)
        int kycScore = 0;
        int accountScore = 0;
        int transactionScore = 0;
        int dtiScore = 0;

        StringBuilder breakdown = new StringBuilder();

        // Factor 1: KYC Verification (Max 150 pts)
        String kycStatus = customer != null && customer.getKycStatus() != null ? customer.getKycStatus().toUpperCase() : "PENDING";
        if ("VERIFIED".equals(kycStatus)) {
            kycScore = 150;
            breakdown.append("KYC: VERIFIED (+150 pts); ");
        } else if ("PENDING".equals(kycStatus)) {
            kycScore = 60;
            breakdown.append("KYC: PENDING (+60 pts, manual check recommended); ");
        } else {
            kycScore = 0;
            breakdown.append("KYC: REJECTED/UNKNOWN (+0 pts); ");
        }

        // Factor 2: Customer & Account Stability (Max 150 pts)
        String customerStatus = customer != null && customer.getStatus() != null ? customer.getStatus().toUpperCase() : "ACTIVE";
        String accountStatus = account != null && account.getStatus() != null ? account.getStatus().toUpperCase() : "ACTIVE";

        if ("ACTIVE".equals(customerStatus) && "ACTIVE".equals(accountStatus)) {
            accountScore += 50;
            BigDecimal currentBalance = account != null && account.getBalance() != null ? account.getBalance() : BigDecimal.ZERO;
            BigDecimal balanceRatio = requestedAmount.compareTo(BigDecimal.ZERO) > 0
                    ? currentBalance.divide(requestedAmount, 4, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            if (balanceRatio.compareTo(BigDecimal.valueOf(0.15)) >= 0) {
                accountScore += 100;
                breakdown.append(String.format("Account: Active with strong balance buffer >15%% (+$%s) (+150 pts); ", currentBalance));
            } else if (balanceRatio.compareTo(BigDecimal.valueOf(0.05)) >= 0) {
                accountScore += 70;
                breakdown.append(String.format("Account: Active with moderate balance buffer (+$%s) (+120 pts); ", currentBalance));
            } else if (currentBalance.compareTo(BigDecimal.ZERO) > 0) {
                accountScore += 40;
                breakdown.append(String.format("Account: Active with positive balance (+$%s) (+90 pts); ", currentBalance));
            } else {
                accountScore += 10;
                breakdown.append("Account: Active with zero balance (+60 pts); ");
            }
        } else {
            breakdown.append(String.format("Account: Inactive or suspended (Cust: %s, Acc: %s) (+0 pts); ", customerStatus, accountStatus));
        }

        // Factor 3: Transaction Health & Cash Flow (Max 150 pts)
        BigDecimal totalInflow = BigDecimal.ZERO;
        BigDecimal totalOutflow = BigDecimal.ZERO;
        if (transactions != null && !transactions.isEmpty()) {
            for (TransactionResponse tx : transactions) {
                if (tx.getAmount() != null) {
                    if ("DEPOSIT".equalsIgnoreCase(tx.getType()) || "TRANSFER_IN".equalsIgnoreCase(tx.getType())) {
                        totalInflow = totalInflow.add(tx.getAmount());
                    } else {
                        totalOutflow = totalOutflow.add(tx.getAmount());
                    }
                }
            }

            if (totalInflow.compareTo(totalOutflow) >= 0) {
                transactionScore = 150;
                breakdown.append(String.format("Cash Flow: Net positive cash flow (Inflow: $%s, Outflow: $%s) (+150 pts); ", totalInflow, totalOutflow));
            } else {
                transactionScore = 75;
                breakdown.append(String.format("Cash Flow: Outflow exceeds inflow (Inflow: $%s, Outflow: $%s) (+75 pts); ", totalInflow, totalOutflow));
            }
        } else {
            // If no prior transaction ledger exists, evaluate declared income vs expenses
            if (monthlyIncome.compareTo(monthlyExpenses.multiply(BigDecimal.valueOf(1.5))) > 0) {
                transactionScore = 120;
                breakdown.append("Cash Flow: Healthy declared income/expense ratio (+120 pts); ");
            } else {
                transactionScore = 60;
                breakdown.append("Cash Flow: Limited transaction history (+60 pts); ");
            }
        }

        // Factor 4: DTI & Affordability (Max 100 pts)
        if (dtiRatio.compareTo(BigDecimal.valueOf(35.0)) <= 0) {
            dtiScore = 100;
            breakdown.append(String.format("Affordability: Prime DTI %s%% <= 35%% (+100 pts); ", dtiRatio));
        } else if (dtiRatio.compareTo(BigDecimal.valueOf(50.0)) <= 0) {
            dtiScore = 70;
            breakdown.append(String.format("Affordability: Moderate DTI %s%% <= 50%% (+70 pts); ", dtiRatio));
        } else if (dtiRatio.compareTo(BigDecimal.valueOf(60.0)) <= 0) {
            dtiScore = 30;
            breakdown.append(String.format("Affordability: High DTI %s%% <= 60%% (+30 pts); ", dtiRatio));
        } else {
            dtiScore = 0;
            breakdown.append(String.format("Affordability: Critical DTI %s%% > 60%% (+0 pts); ", dtiRatio));
        }

        // Final Score Calculation (300 Base + Factor Sum)
        int creditScore = 300 + kycScore + accountScore + transactionScore + dtiScore;
        if (creditScore > 850) creditScore = 850;
        if (creditScore < 300) creditScore = 300;

        // 4. Determine Risk Level & Assessment Decision
        RiskLevel riskLevel;
        AssessmentDecision decision;
        String summary;

        boolean hardRejectKyc = "REJECTED".equalsIgnoreCase(kycStatus);
        boolean criticalDti = dtiRatio.compareTo(BigDecimal.valueOf(60.0)) > 0;
        boolean unaffordableEmi = netDisposableIncome.compareTo(proposedEmi) < 0;

        if (hardRejectKyc || criticalDti || unaffordableEmi || creditScore < 550) {
            riskLevel = RiskLevel.HIGH;
            decision = AssessmentDecision.REJECTED;
            summary = String.format("High credit risk (Score: %d, DTI: %s%%). %s",
                    creditScore, dtiRatio,
                    hardRejectKyc ? "KYC verification failed." :
                    unaffordableEmi ? "Proposed EMI exceeds net disposable monthly income." : "Score below minimum threshold.");
        } else if (creditScore >= 700 && dtiRatio.compareTo(BigDecimal.valueOf(50.0)) <= 0 && "VERIFIED".equalsIgnoreCase(kycStatus)) {
            riskLevel = RiskLevel.LOW;
            decision = AssessmentDecision.APPROVED;
            summary = String.format("Low credit risk (Score: %d, DTI: %s%%). Customer qualifies for instant loan approval.", creditScore, dtiRatio);
        } else {
            riskLevel = RiskLevel.MEDIUM;
            decision = AssessmentDecision.MANUAL_REVIEW;
            summary = String.format("Moderate credit risk (Score: %d, DTI: %s%%). Manual underwriting review recommended.", creditScore, dtiRatio);
        }

        // 5. Max Eligible Amount Calculation
        // Max permissible EMI at 50% DTI
        BigDecimal maxAllowedEmi = monthlyIncome.multiply(BigDecimal.valueOf(0.50)).subtract(existingMonthlyDebt);
        if (maxAllowedEmi.compareTo(BigDecimal.ZERO) < 0) maxAllowedEmi = BigDecimal.ZERO;

        BigDecimal maxEligibleAmount = calculateMaxPrincipalFromEmi(maxAllowedEmi, annualRate, tenureMonths);
        if (maxEligibleAmount.compareTo(product.getMaxAmount()) > 0) {
            maxEligibleAmount = product.getMaxAmount();
        }

        return CreditAssessment.builder()
                .applicationId(application.getId())
                .creditScore(creditScore)
                .riskLevel(riskLevel)
                .decision(decision)
                .assessedMonthlyIncome(monthlyIncome)
                .assessedMonthlyExpenses(monthlyExpenses)
                .existingMonthlyDebt(existingMonthlyDebt)
                .debtToIncomeRatio(dtiRatio)
                .proposedEmi(proposedEmi)
                .maxEligibleAmount(maxEligibleAmount)
                .scoreBreakdown(breakdown.toString())
                .assessmentSummary(summary)
                .assessedAt(LocalDateTime.now())
                .build();
    }

    private BigDecimal calculateMonthlyIncomeFromTransactions(List<TransactionResponse> transactions) {
        if (transactions == null || transactions.isEmpty()) {
            return BigDecimal.ZERO;
        }
        BigDecimal totalDeposits = BigDecimal.ZERO;
        for (TransactionResponse tx : transactions) {
            if ("DEPOSIT".equalsIgnoreCase(tx.getType()) || "TRANSFER_IN".equalsIgnoreCase(tx.getType())) {
                if (tx.getAmount() != null) {
                    totalDeposits = totalDeposits.add(tx.getAmount());
                }
            }
        }
        // Approximate monthly average
        return totalDeposits.divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateMaxPrincipalFromEmi(BigDecimal maxEmi, BigDecimal annualRate, int tenureMonths) {
        if (maxEmi.compareTo(BigDecimal.ZERO) <= 0 || tenureMonths <= 0) {
            return BigDecimal.ZERO;
        }
        if (annualRate == null || annualRate.compareTo(BigDecimal.ZERO) == 0) {
            return maxEmi.multiply(BigDecimal.valueOf(tenureMonths)).setScale(2, RoundingMode.HALF_UP);
        }
        double r = (annualRate.doubleValue() / 100.0) / 12.0;
        double factor = Math.pow(1.0 + r, tenureMonths);
        double maxPrincipal = maxEmi.doubleValue() * (factor - 1.0) / (r * factor);
        return BigDecimal.valueOf(maxPrincipal).setScale(2, RoundingMode.HALF_UP);
    }
}
