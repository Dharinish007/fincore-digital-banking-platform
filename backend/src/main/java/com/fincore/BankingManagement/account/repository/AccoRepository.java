package com.fincore.BankingManagement.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fincore.BankingManagement.account.entity.Account;

@Repository
public interface AccoRepository extends JpaRepository<Account, String> {

    boolean existsByAccountNo(String accountNo);
}