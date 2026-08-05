package com.fincore.BankingManagement.Repositery.TransactionRepository.AccountRepositery;

import com.fincore.BankingManagement.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account,Long> {
    Optional<Account> findByAccountNumber(String accountNumber);
}