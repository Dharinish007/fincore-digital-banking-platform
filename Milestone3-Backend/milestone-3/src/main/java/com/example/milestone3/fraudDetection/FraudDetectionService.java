package com.example.milestone3.fraudDetection;

import com.example.milestone3.settlementEngine.entity.Loan;
import com.example.milestone3.settlementEngine.entity.Transaction;
import com.example.milestone3.settlementEngine.repo.LoanRepo;
import com.example.milestone3.settlementEngine.repo.TransactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service

public class FraudDetectionService {
    @Autowired
    private TransactionRepo transactionRepository;
    @Autowired
    private FraudEventRepo fraudEventRepository;
    @Autowired
    private LoanRepo loanRepo;
    public record FraudResult(
            int score,
            String status,
            List<String> reasons
    ) { }

    public FraudResult checkTransaction(Transaction transaction) {

        int score = 0;

        List<String> reasons = new ArrayList<>();
        Loan loan = loanRepo
                .findById(transaction.getLoanId())
                .orElseThrow(() ->
                        new RuntimeException("Loan not found"));

        Long userId = loan.getCustomerId();


        if (transaction.getAmount()
                .compareTo(new BigDecimal("100000")) >= 0) {

            score += 30;

            reasons.add("Large transaction amount");
        }


        long recentTransactions =
                transactionRepository.countRecentTransactions(
                        userId,
                        LocalDateTime.now().minusMinutes(5)
                );

        if (recentTransactions >= 5) {

            score += 25;

            reasons.add(
                    "Too many transactions in short time"
            );
        }

        String fraudStatus;

        if (score >= 80) {
            fraudStatus = "BLOCKED";

        } else if (score >= 50) {
            fraudStatus = "UNDER_REVIEW";

        } else if (score >= 25) {
            fraudStatus = "SUSPICIOUS";

        } else {
            fraudStatus = "SAFE";
        }

        return new FraudResult(
                score,
                fraudStatus,
                reasons
        );
    }

    public void saveFraudEvent(
            Transaction transaction,
            FraudResult result) {
        Loan loan = loanRepo
                .findById(transaction.getLoanId())
                .orElseThrow(() ->
                        new RuntimeException("Loan not found"));

        Long userId = loan.getCustomerId();

        FraudEvent fraudEvent = new FraudEvent();

        fraudEvent.setUserId(
                userId
        );

        fraudEvent.setTransactionId(
                transaction.getId()
        );

        fraudEvent.setFraudScore(
                result.score()
        );

        fraudEvent.setStatus(
                result.status()
        );

        fraudEvent.setReason(
                String.join(", ", result.reasons())
        );

        fraudEvent.setCreatedAt(
                LocalDateTime.now()
        );

        fraudEventRepository.save(fraudEvent);
    }
}
