package com.fincore.transaction.service;

import com.fincore.transaction.entity.Transaction;
import com.fincore.transaction.entity.TransactionStatus;
import com.fincore.transaction.entity.TransactionType;
import com.fincore.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class TransactionAuditService {

    private final TransactionRepository transactionRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordFailedTransaction(String referenceId, String accountNumber, String counterpartyAccountNumber,
                                        TransactionType type, BigDecimal amount, BigDecimal balanceAfter, String remarks) {
        Transaction failedTx = Transaction.builder()
                .referenceId(referenceId)
                .accountNumber(accountNumber)
                .counterpartyAccountNumber(counterpartyAccountNumber)
                .type(type)
                .amount(amount)
                .balanceAfter(balanceAfter)
                .status(TransactionStatus.FAILED)
                .remarks(remarks)
                .build();
        
        transactionRepository.save(failedTx);
    }
}
