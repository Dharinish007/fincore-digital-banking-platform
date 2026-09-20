package com.fincore.loan.service;

import com.fincore.loan.dto.EmiCalculationRequest;
import com.fincore.loan.dto.EmiCalculationResponse;
import com.fincore.loan.dto.RepaymentScheduleItem;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmiCalculatorService {

    private static final int SCALE = 2;
    private static final RoundingMode ROUNDING = RoundingMode.HALF_UP;

    /**
     * Calculates the monthly reducing-balance EMI.
     * Formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
     */
    public BigDecimal calculateMonthlyEmi(BigDecimal principal, BigDecimal annualInterestRate, int tenureMonths) {
        if (principal == null || principal.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Principal amount must be greater than zero");
        }
        if (tenureMonths <= 0) {
            throw new IllegalArgumentException("Tenure months must be at least 1");
        }
        if (annualInterestRate == null || annualInterestRate.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Interest rate cannot be negative");
        }

        // Case 1: Zero interest loan
        if (annualInterestRate.compareTo(BigDecimal.ZERO) == 0) {
            return principal.divide(BigDecimal.valueOf(tenureMonths), SCALE, ROUNDING);
        }

        // Case 2: Standard reducing balance
        double p = principal.doubleValue();
        double annualRate = annualInterestRate.doubleValue();
        double r = (annualRate / 100.0) / 12.0;
        int n = tenureMonths;

        double factor = Math.pow(1.0 + r, n);
        double emi = p * r * factor / (factor - 1.0);

        return BigDecimal.valueOf(emi).setScale(SCALE, ROUNDING);
    }

    /**
     * Generates a complete amortization repayment schedule starting from a given date.
     */
    public List<RepaymentScheduleItem> generateSchedule(
            BigDecimal principal,
            BigDecimal annualInterestRate,
            int tenureMonths,
            LocalDate startDate) {

        BigDecimal emi = calculateMonthlyEmi(principal, annualInterestRate, tenureMonths);
        List<RepaymentScheduleItem> items = new ArrayList<>(tenureMonths);

        BigDecimal currentBalance = principal.setScale(SCALE, ROUNDING);
        double monthlyRate = (annualInterestRate.doubleValue() / 100.0) / 12.0;
        LocalDate currentDate = startDate != null ? startDate : LocalDate.now();

        for (int month = 1; month <= tenureMonths; month++) {
            LocalDate dueDate = currentDate.plusMonths(month);
            BigDecimal beginningBalance = currentBalance;

            BigDecimal interestComponent;
            if (annualInterestRate.compareTo(BigDecimal.ZERO) == 0) {
                interestComponent = BigDecimal.ZERO.setScale(SCALE, ROUNDING);
            } else {
                interestComponent = beginningBalance.multiply(BigDecimal.valueOf(monthlyRate)).setScale(SCALE, ROUNDING);
            }

            BigDecimal principalComponent;
            BigDecimal actualEmi;
            BigDecimal endingBalance;

            if (month == tenureMonths) {
                // Final month: pay off exact remaining balance
                principalComponent = beginningBalance;
                actualEmi = principalComponent.add(interestComponent).setScale(SCALE, ROUNDING);
                endingBalance = BigDecimal.ZERO.setScale(SCALE, ROUNDING);
            } else {
                principalComponent = emi.subtract(interestComponent).setScale(SCALE, ROUNDING);
                if (principalComponent.compareTo(beginningBalance) > 0) {
                    principalComponent = beginningBalance;
                }
                endingBalance = beginningBalance.subtract(principalComponent).setScale(SCALE, ROUNDING);
                actualEmi = emi;
            }

            currentBalance = endingBalance;

            items.add(RepaymentScheduleItem.builder()
                    .installmentNumber(month)
                    .dueDate(dueDate)
                    .beginningBalance(beginningBalance)
                    .emiAmount(actualEmi)
                    .principalComponent(principalComponent)
                    .interestComponent(interestComponent)
                    .endingBalance(endingBalance)
                    .build());
        }

        return items;
    }

    /**
     * Previews EMI and full amortization calculation for arbitrary inputs.
     */
    public EmiCalculationResponse previewCalculation(EmiCalculationRequest req) {
        BigDecimal emi = calculateMonthlyEmi(req.getPrincipalAmount(), req.getAnnualInterestRate(), req.getTenureMonths());
        List<RepaymentScheduleItem> schedule = generateSchedule(
                req.getPrincipalAmount(),
                req.getAnnualInterestRate(),
                req.getTenureMonths(),
                LocalDate.now()
        );

        BigDecimal totalRepayment = schedule.stream()
                .map(RepaymentScheduleItem::getEmiAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(SCALE, ROUNDING);

        BigDecimal totalInterest = totalRepayment.subtract(req.getPrincipalAmount()).setScale(SCALE, ROUNDING);

        return EmiCalculationResponse.builder()
                .principalAmount(req.getPrincipalAmount().setScale(SCALE, ROUNDING))
                .annualInterestRate(req.getAnnualInterestRate().setScale(SCALE, ROUNDING))
                .tenureMonths(req.getTenureMonths())
                .monthlyEmi(emi)
                .totalInterest(totalInterest)
                .totalRepaymentAmount(totalRepayment)
                .amortizationSchedule(schedule)
                .build();
    }
}
