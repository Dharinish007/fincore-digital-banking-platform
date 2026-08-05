package com.fincore.BankingManagement.BankingServices.Impl;
import com.fincore.BankingManagement.BankingServices.TransactionService;
import com.fincore.BankingManagement.Repositery.TransactionRepository.AccountRepositery.AccountRepository;
import com.fincore.BankingManagement.Repositery.TransactionRepository.TransactionRepository;
import com.fincore.BankingManagement.dto.TransferRequest;
import com.fincore.BankingManagement.dto.TransferResponse;
import com.fincore.BankingManagement.model.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fincore.BankingManagement.Exception.AccountNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class TransactionServiceImp implements TransactionService {
    @Autowired
    private AccountRepository accountRepositery;
    @Autowired
    private TransactionRepository transactionrepo;

    @Override
    @Transactional
    public TransferResponse transferFunds(TransferRequest request) throws AccountNotFoundException {
        Account sender = accountRepositery
                .findByAccountNumber(request.getSenderAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("Sender Account Not Found"));
        Account receiver = accountRepositery
                .findByAccountNumber(request.getReceiverAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("Receiver Account Not Found"));
        BigDecimal amount = request.getAmount();
        BigDecimal balance = sender.getBalance().subtract(amount);
        if (balance.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Insufficient Balance");
        }
        sender.setBalance(balance);
        receiver.setBalance(receiver.getBalance().add(amount));
        accountRepositery.save(sender);
        accountRepositery.save(receiver);

        com.fincore.BankingManagement.model.TransactionHistory history = new com.fincore.BankingManagement.model.TransactionHistory();

        history.setSenderAccount(sender);

        history.setReceiverAccount(receiver);

        history.setAmount(request.getAmount());

        history.setStatus("SUCCESS");

        history.setTransactionType("TRANSFER");

        history.setTransactionDate(LocalDateTime.now());

        transactionrepo.save(history);
        return new TransferResponse(

                UUID.randomUUID().toString(),
                "SUCCESS",
                "Money transferred successfully",
                request.getAmount(),
                sender.getBalance(),
                LocalDateTime.now()
        );
    }
    public BigDecimal balanceEnquiry(String accountNumber) {
        Account acc = accountRepositery.findByAccountNumber(accountNumber).orElseThrow(() -> new RuntimeException("Account Not Found"));
        return acc.getBalance();
    }
}