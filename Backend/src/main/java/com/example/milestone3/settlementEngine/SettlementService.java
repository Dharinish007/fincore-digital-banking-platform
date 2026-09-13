package com.example.milestone3.settlementEngine;

import com.example.milestone3.fraudDetection.FraudDetectionService;
import com.example.milestone3.settlementEngine.entity.Loan;
import com.example.milestone3.settlementEngine.entity.Settlement;
import com.example.milestone3.settlementEngine.entity.Transaction;
import com.example.milestone3.settlementEngine.repo.LoanRepo;
import com.example.milestone3.settlementEngine.repo.SettlementRepo;
import com.example.milestone3.settlementEngine.repo.TransactionRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SettlementService {

    @Autowired
    private TransactionRepo transactionRepo;
    @Autowired
    private LoanRepo loanRepo;
    @Autowired
    private SettlementRepo settlementRepo;
    @Autowired
    private PaymentAllocationService allocationService;
    @Autowired
    private FraudDetectionService fraudDetectionService;

    @Transactional
    public Settlement settlePayment(Long transactionId) {

        Transaction transaction =
                transactionRepo.findById(transactionId)
                        .orElseThrow(() ->
                                new RuntimeException("Transaction not found"));

        if (transaction.getStatus().equals("SETTLED")) {
            throw new RuntimeException(
                    "Transaction already settled"
            );
        }
        FraudDetectionService.FraudResult fraudResult =
                fraudDetectionService
                        .checkTransaction(transaction);

        fraudDetectionService.saveFraudEvent(
                transaction,
                fraudResult
        );

        // Block transaction
        if (fraudResult.status()
                .equals("BLOCKED")) {

            transaction.setStatus(
                   "BLOCKED"
            );

            transactionRepo.save(transaction);

            throw new RuntimeException(
                    "Transaction blocked due to fraud detection"
            );
        }

        // Hold for manual review
        if (fraudResult.status()
                .equals("UNDER_REVIEW")) {

            transaction.setStatus(
                    "UNDER_REVIEW"
            );

            transactionRepo.save(transaction);

            throw new RuntimeException(
                    "Transaction is under fraud review"
            );
        }
        transaction.setStatus("PROCESSING");

        Loan loan = loanRepo
                .findById(transaction.getLoanId())
                .orElseThrow(() ->
                        new RuntimeException("Loan not found"));

        PaymentAllocationService.PaymentAllocation allocation =
                allocationService.allocate(
                        transaction.getAmount(),
                        loan.getPenaltyOutstanding(),
                        loan.getInterestOutstanding(),
                        loan.getPrincipalOutstanding()
                );

        // Update balances
        loan.setPenaltyOutstanding(
                loan.getPenaltyOutstanding()
                        .subtract(allocation.penalty())
        );

        loan.setInterestOutstanding(
                loan.getInterestOutstanding()
                        .subtract(allocation.interest())
        );

        loan.setPrincipalOutstanding(
                loan.getPrincipalOutstanding()
                        .subtract(allocation.principal())
        );

        loan.setTotalOutstanding(
                loan.getPenaltyOutstanding()
                        .add(loan.getInterestOutstanding())
                        .add(loan.getPrincipalOutstanding())
        );

        transaction.setStatus("SETTLED");

        Settlement settlement = new Settlement();

        settlement.setTransactionId(transaction.getId());
        settlement.setLoanId(loan.getId());
        settlement.setSettledAmount(transaction.getAmount());
        settlement.setStatus("SETTLED");
        settlement.setSettledAt(LocalDateTime.now());

        loanRepo.save(loan);
        transactionRepo.save(transaction);
        return settlementRepo.save(settlement);
    }
}
