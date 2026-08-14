package com.fincore.BankingManagement.EMI.service;

import com.fincore.BankingManagement.EMI.dto.EMICalculationRequest;
import com.fincore.BankingManagement.EMI.dto.EMICalculationResponse;
import com.fincore.BankingManagement.EMI.entity.EMICalculation;
import com.fincore.BankingManagement.EMI.repository.EMICalculationRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class EMICalculationService {

    private final EMICalculationRepository emiRepository;

    public EMICalculationService(EMICalculationRepository emiRepository) {
        this.emiRepository = emiRepository;
    }

    public EMICalculationResponse calculateEMI(
            EMICalculationRequest request) {

        validateRequest(request);

        BigDecimal principal = request.getPrincipalAmount();
        BigDecimal annualInterestRate = request.getInterestRate();
        int tenureMonths = request.getTenureMonths();

        // Convert annual interest rate to monthly interest rate
        BigDecimal monthlyRate = annualInterestRate
                .divide(BigDecimal.valueOf(1200), 10, RoundingMode.HALF_UP);

        BigDecimal emi;

        // If interest rate is zero
        if (monthlyRate.compareTo(BigDecimal.ZERO) == 0) {

            emi = principal.divide(
                    BigDecimal.valueOf(tenureMonths),
                    2,
                    RoundingMode.HALF_UP
            );

        } else {

            double power = Math.pow(
                    BigDecimal.ONE
                            .add(monthlyRate)
                            .doubleValue(),
                    tenureMonths
            );

            BigDecimal powerValue = BigDecimal.valueOf(power);

            BigDecimal numerator = principal
                    .multiply(monthlyRate)
                    .multiply(powerValue);

            BigDecimal denominator = powerValue
                    .subtract(BigDecimal.ONE);

            emi = numerator.divide(
                    denominator,
                    2,
                    RoundingMode.HALF_UP
            );
        }

        BigDecimal totalPayable = emi
                .multiply(BigDecimal.valueOf(tenureMonths))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalInterest = totalPayable
                .subtract(principal)
                .setScale(2, RoundingMode.HALF_UP);

        // Create entity
        EMICalculation emiCalculation = new EMICalculation();

        emiCalculation.setLoanId(request.getLoanId());
        emiCalculation.setPrincipalAmount(principal);
        emiCalculation.setInterestRate(annualInterestRate);
        emiCalculation.setTenureMonths(tenureMonths);
        emiCalculation.setMonthlyEmi(emi);
        emiCalculation.setTotalInterest(totalInterest);
        emiCalculation.setTotalPayable(totalPayable);

        // Save to database
        EMICalculation saved = emiRepository.save(emiCalculation);

        return convertToResponse(saved);
    }

    private void validateRequest(EMICalculationRequest request) {

        if (request.getLoanId() == null) {
            throw new IllegalArgumentException("Loan ID is required");
        }

        if (request.getPrincipalAmount() == null ||
                request.getPrincipalAmount()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Principal amount must be greater than zero"
            );
        }

        if (request.getInterestRate() == null ||
                request.getInterestRate()
                        .compareTo(BigDecimal.ZERO) < 0) {

            throw new IllegalArgumentException(
                    "Interest rate cannot be negative"
            );
        }

        if (request.getTenureMonths() == null ||
                request.getTenureMonths() <= 0) {

            throw new IllegalArgumentException(
                    "Tenure must be greater than zero"
            );
        }
    }

    private EMICalculationResponse convertToResponse(
            EMICalculation entity) {

        EMICalculationResponse response =
                new EMICalculationResponse();

        response.setEmiId(entity.getEmiId());
        response.setLoanId(entity.getLoanId());
        response.setPrincipalAmount(entity.getPrincipalAmount());
        response.setInterestRate(entity.getInterestRate());
        response.setTenureMonths(entity.getTenureMonths());
        response.setMonthlyEmi(entity.getMonthlyEmi());
        response.setTotalInterest(entity.getTotalInterest());
        response.setTotalPayable(entity.getTotalPayable());
        response.setCalculatedAt(entity.getCalculatedAt());

        return response;
    }
}