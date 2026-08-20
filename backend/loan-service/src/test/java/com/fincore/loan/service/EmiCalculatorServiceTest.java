package com.fincore.loan.service;

import com.fincore.loan.dto.EmiCalculationRequest;
import com.fincore.loan.dto.EmiCalculationResponse;
import com.fincore.loan.dto.RepaymentScheduleItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class EmiCalculatorServiceTest {

    private EmiCalculatorService emiCalculatorService;

    @BeforeEach
    void setUp() {
        emiCalculatorService = new EmiCalculatorService();
    }

    @Test
    @DisplayName("Should accurately calculate reducing-balance EMI for standard personal loan")
    void testStandardEmiCalculation() {
        // $10,000 at 12% annual interest for 12 months -> EMI is approx $888.49
        BigDecimal principal = new BigDecimal("10000.00");
        BigDecimal annualRate = new BigDecimal("12.00");
        int tenure = 12;

        BigDecimal emi = emiCalculatorService.calculateMonthlyEmi(principal, annualRate, tenure);

        assertNotNull(emi);
        assertEquals(new BigDecimal("888.49"), emi);
    }

    @Test
    @DisplayName("Should handle 0% interest rate loans correctly")
    void testZeroInterestLoan() {
        BigDecimal principal = new BigDecimal("12000.00");
        BigDecimal annualRate = BigDecimal.ZERO;
        int tenure = 12;

        BigDecimal emi = emiCalculatorService.calculateMonthlyEmi(principal, annualRate, tenure);

        assertEquals(new BigDecimal("1000.00"), emi);
    }

    @Test
    @DisplayName("Should generate complete repayment schedule where final ending balance is exactly zero")
    void testRepaymentScheduleGeneration() {
        BigDecimal principal = new BigDecimal("5000.00");
        BigDecimal annualRate = new BigDecimal("10.00");
        int tenure = 6;

        List<RepaymentScheduleItem> schedule = emiCalculatorService.generateSchedule(
                principal, annualRate, tenure, LocalDate.of(2026, 1, 1)
        );

        assertNotNull(schedule);
        assertEquals(6, schedule.size());

        // First installment begins with full principal
        assertEquals(principal.setScale(2, RoundingMode.HALF_UP), schedule.get(0).getBeginningBalance());

        // Final installment ending balance is 0.00
        assertEquals(new BigDecimal("0.00"), schedule.get(schedule.size() - 1).getEndingBalance());

        // Total principal paid across schedule equals original loan principal
        BigDecimal totalPrincipalPaid = schedule.stream()
                .map(RepaymentScheduleItem::getPrincipalComponent)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        assertEquals(principal.setScale(2, RoundingMode.HALF_UP), totalPrincipalPaid);
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException on invalid inputs")
    void testInvalidInputs() {
        assertThrows(IllegalArgumentException.class, () ->
                emiCalculatorService.calculateMonthlyEmi(BigDecimal.ZERO, new BigDecimal("10.00"), 12));

        assertThrows(IllegalArgumentException.class, () ->
                emiCalculatorService.calculateMonthlyEmi(new BigDecimal("1000.00"), new BigDecimal("10.00"), 0));

        assertThrows(IllegalArgumentException.class, () ->
                emiCalculatorService.calculateMonthlyEmi(new BigDecimal("1000.00"), new BigDecimal("-5.00"), 12));
    }

    @Test
    @DisplayName("Should return full preview calculation")
    void testPreviewCalculation() {
        EmiCalculationRequest request = EmiCalculationRequest.builder()
                .principalAmount(new BigDecimal("25000.00"))
                .annualInterestRate(new BigDecimal("7.50"))
                .tenureMonths(24)
                .build();

        EmiCalculationResponse response = emiCalculatorService.previewCalculation(request);

        assertNotNull(response);
        assertTrue(response.getMonthlyEmi().compareTo(BigDecimal.ZERO) > 0);
        assertTrue(response.getTotalInterest().compareTo(BigDecimal.ZERO) > 0);
        assertEquals(24, response.getAmortizationSchedule().size());
    }
}
