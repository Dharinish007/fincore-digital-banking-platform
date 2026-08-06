package com.fincore.BankingManagement.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fincore.BankingManagement.account.entity.Account;

public interface AccountRepository extends JpaRepository<Account, String> {

}