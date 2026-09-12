package com.example.milestone3.settlementEngine;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
@Service
public class PaymentAllocationService {
    public record PaymentAllocation(
            BigDecimal principal,
            BigDecimal interest,
            BigDecimal penalty
    ) {}
    public PaymentAllocation allocate(
            BigDecimal payment,
            BigDecimal penalty,
            BigDecimal interest,
            BigDecimal principal) {

        BigDecimal remaining = payment;

        BigDecimal penaltyPaid =
                remaining.min(penalty);
        remaining = remaining.subtract(penaltyPaid);

        BigDecimal interestPaid =
                remaining.min(interest);
        remaining = remaining.subtract(interestPaid);

        BigDecimal principalPaid =
                remaining.min(principal);

        return new PaymentAllocation(
                principalPaid,
                interestPaid,
                penaltyPaid
        );
    }

}
