package com.fincore.BankingManagement.Milestone1.account.BankingServices.repository.TransactionRepository.AccountRepositery;

import com.fincore.BankingManagement.Entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account,Long> {
    Optional<Account> findByAccountNo(String accountNo);
}