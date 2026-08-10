package com.fincore.BankingManagement.BankingServices.Impl;
import com.fincore.BankingManagement.BankingServices.TransactionService;
import com.fincore.BankingManagement.BankingServices.Enums.TransactionType;
import com.fincore.BankingManagement.BankingServices.repository.TransactionRepository.AccountRepositery.AccountRepository;
import com.fincore.BankingManagement.BankingServices.repository.TransactionRepository.TransactionRepository;
import com.fincore.BankingManagement.BankingServices.dto.TransferRequest;
import com.fincore.BankingManagement.BankingServices.dto.TransferResponse;
import com.fincore.BankingManagement.Entities.Transaction;
import com.fincore.BankingManagement.Entities.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fincore.BankingManagement.BankingServices.Exception.AccountNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDate;
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
                .findByAccountNo(request.getSenderAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("Sender Account Not Found"));
        Account receiver = accountRepositery
                .findByAccountNo(request.getReceiverAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("Receiver Account Not Found"));
        if (sender.getAccountNo().equals(receiver.getAccountNo())) {
            throw new RuntimeException("Sender and Receiver accounts cannot be the same");
        }
        BigDecimal amount = request.getAmount();
        BigDecimal balance = sender.getBalance().subtract(amount);
        if (balance.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Insufficient Balance");
        }
        sender.setBalance(balance);
        receiver.setBalance(receiver.getBalance().add(amount));
        accountRepositery.save(sender);
        accountRepositery.save(receiver);

        Transaction history = new Transaction();
        history.setAccount(sender);
        history.setAmount(amount);
        history.setTransactionDate(LocalDate.now());
        history.setTransactionType(TransactionType.Transfer);

        transactionrepo.save(history);
        return new TransferResponse(

                UUID.randomUUID().toString(),
                "SUCCESS",
                request.getAmount(),
                sender.getBalance(),
                LocalDate.now()
        );
    }

    public BigDecimal balanceEnquiry(String accountNumber) {
        Account acc = accountRepositery.findByAccountNo(accountNumber).orElseThrow(() -> new RuntimeException("Account Not Found"));
        return acc.getBalance();
    }

    public ResponseEntity<?> getReceiver(String accountNumber) {
        Account receiver=accountRepositery.findByAccountNo(accountNumber).orElseThrow(() -> new RuntimeException("Account Not Found"));
        return new ResponseEntity<>(receiver.getCustomer().getFullName(), HttpStatus.OK);
    }
}