package com.fincore.transaction.config;

import com.fincore.transaction.entity.Transaction;
import com.fincore.transaction.entity.TransactionStatus;
import com.fincore.transaction.entity.TransactionType;
import com.fincore.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionDataInitializer implements CommandLineRunner {

    private final TransactionRepository transactionRepository;

    @Override
    public void run(String... args) {
        log.info("Verifying Transaction Service seed state...");

        if (transactionRepository.count() == 0) {
            log.info("No transactions found in database. Initializing demo transactions...");

            Transaction t1 = Transaction.builder()
                    .referenceId("TXN-INIT-001")
                    .accountNumber("4827298246")
                    .type(TransactionType.DEPOSIT)
                    .amount(new BigDecimal("1000.00"))
                    .balanceAfter(new BigDecimal("1000.00"))
                    .status(TransactionStatus.SUCCESS)
                    .remarks("Initial Account Funding")
                    .build();

            Transaction t2 = Transaction.builder()
                    .referenceId("TXN-INIT-002")
                    .accountNumber("4827298246")
                    .type(TransactionType.WITHDRAWAL)
                    .amount(new BigDecimal("200.00"))
                    .balanceAfter(new BigDecimal("800.00"))
                    .status(TransactionStatus.SUCCESS)
                    .remarks("ATM Cash Withdrawal")
                    .build();

            Transaction t3 = Transaction.builder()
                    .referenceId("TXN-INIT-003-OUT")
                    .accountNumber("4827298246")
                    .counterpartyAccountNumber("4269034115")
                    .type(TransactionType.TRANSFER_OUT)
                    .amount(new BigDecimal("300.00"))
                    .balanceAfter(new BigDecimal("500.00"))
                    .status(TransactionStatus.SUCCESS)
                    .remarks("Internal Transfer to Savings")
                    .build();

            Transaction t4 = Transaction.builder()
                    .referenceId("TXN-INIT-003-IN")
                    .accountNumber("4269034115")
                    .counterpartyAccountNumber("4827298246")
                    .type(TransactionType.TRANSFER_IN)
                    .amount(new BigDecimal("300.00"))
                    .balanceAfter(new BigDecimal("300.00"))
                    .status(TransactionStatus.SUCCESS)
                    .remarks("Internal Transfer from Checking")
                    .build();

            transactionRepository.saveAll(List.of(t1, t2, t3, t4));
            log.info("Successfully seeded 4 demo transactions.");
        } else {
            log.info("Transaction ledger contains {} records.", transactionRepository.count());
        }
    }
}
