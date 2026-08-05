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
    public TransferResponse transferFunds(TransferRequest request)  {
        Account sender = accountRepositery
                .findByAccountNumber(request.getSenderAccountNumber())
                .orElseThrow(() ->
                        new RuntimeException("Sender Account Not Found"));
        Account receiver=accountRepositery
                .findByAccountNumber(request.getReceiverAccountNumber())
                .orElseThrow(()->new RuntimeException("Receiver Account Not Found"));
        BigDecimal amount=request.getAmount();
        if(sender.getBalance().subtract(amount).compareTo(amount)<=0){
            throw new RuntimeException("Insufficient Balance");
        }
        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));
        accountRepositery.save(sender);
        accountRepositery.save(receiver);

        com.fincore.BankingManagement.model.TransactionHistory history=new com.fincore.BankingManagement.model.TransactionHistory();

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

                LocalDateTime.now()
        );
    }
}