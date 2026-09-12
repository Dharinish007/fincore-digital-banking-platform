package com.example.milestone2loanmanagement.EMI;

import com.example.milestone2loanmanagement.EMI.DTO.emiGetResponse;
import com.example.milestone2loanmanagement.EMI.DTO.EmiCalculationRequest;
import com.example.milestone2loanmanagement.EMI.DTO.EmiCalculationResponse;
import com.example.milestone2loanmanagement.collection.LoanEntity;
import com.example.milestone2loanmanagement.collection.LoanRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service

public class EMIService {
    @Autowired
    private LoanRepo loanRepo;
    @Autowired
    private EMIRepo emiRepo;
    public EmiCalculationResponse calculate(EmiCalculationRequest EmiCalculationRequest) {
        BigDecimal principal= EmiCalculationRequest.getPrincipalAmount();
        Integer months= EmiCalculationRequest.getMonths();
        BigDecimal annual= EmiCalculationRequest.getInterestRate();
        BigDecimal monthlyRate=annual.divide(BigDecimal.valueOf(12*100),10, RoundingMode.HALF_UP);
        double power = Math.pow(
                1 + monthlyRate.doubleValue(),
                months
        );
        double emi =
                principal.doubleValue()
                        * monthlyRate.doubleValue()
                        * power
                        / (power - 1);

        BigDecimal emiAmount =
                BigDecimal.valueOf(emi)
                        .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalAmount =
                emiAmount
                        .multiply(BigDecimal.valueOf(months))
                        .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalInterest =
                totalAmount
                        .subtract(principal)
                        .setScale(2, RoundingMode.HALF_UP);
        return new EmiCalculationResponse(

                emiAmount,totalAmount,totalInterest

        );
    }


    public List<emiGetResponse> generateSchedule(Long loanId) {
        LoanEntity loan = loanRepo.findById(loanId)
                .orElseThrow(() ->
                        new RuntimeException("Loan not found"));

        // Calculate EMI
        EmiCalculationRequest request =
                new EmiCalculationRequest(
                        loan.getPrincipalAmount(),
                        loan.getAnnualInterestRate(),
                        loan.getTenureMonths()
                );

        EmiCalculationResponse calculation =
                calculate(request);

        BigDecimal balance = loan.getPrincipalAmount();
        BigDecimal monthlyRate =
                loan.getAnnualInterestRate()
                        .divide(
                                BigDecimal.valueOf(12 * 100),
                                10,
                                RoundingMode.HALF_UP
                        );

        List<EMIEntity> emis = new java.util.ArrayList<>();

        LocalDate dueDate = loan.getStartDate();

        for (int i = 1; i <= loan.getTenureMonths(); i++) {

            BigDecimal interest =
                    balance.multiply(monthlyRate)
                            .setScale(2, RoundingMode.HALF_UP);

            BigDecimal principal =
                    calculation.getEmiAmount()
                            .subtract(interest)
                            .setScale(2, RoundingMode.HALF_UP);
            if (principal.compareTo(balance) > 0) {
                principal = balance;
            }

            EMIEntity emi = new EMIEntity();

            emi.setLoan(loan);
            emi.setInstallmentNumber(i);
            emi.setDueDate(dueDate.plusMonths(i));
            emi.setEmiAmount(calculation.getEmiAmount());
            emi.setPrincipalAmount(principal);
            emi.setInterestAmount(interest);
            emi.setAmountPaid(BigDecimal.ZERO);
            emi.setStatus("PENDING");

            balance = balance.subtract(principal);

            emis.add(emi);
        }emiRepo.saveAll(emis);

        return emis.stream()
                .map(this::convertToResponse)
                .toList();

    }
    public List<emiGetResponse> getEmisByLoan(Long loanId) {

        if (!loanRepo.existsById(loanId)) {
            throw new RuntimeException("Loan not found");
        }

        return emiRepo
                .findByLoanIdOrderByInstallmentNumber(loanId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }
    private emiGetResponse convertToResponse(EMIEntity emi) {

        return new emiGetResponse(
                emi.getId(),
                emi.getLoan().getId(),
                emi.getInstallmentNumber(),
                emi.getDueDate(),
                emi.getEmiAmount(),
                emi.getPrincipalAmount(),
                emi.getInterestAmount(),
                emi.getAmountPaid(),
                emi.getPaymentDate(),
                emi.getStatus()
        );
    }
}
