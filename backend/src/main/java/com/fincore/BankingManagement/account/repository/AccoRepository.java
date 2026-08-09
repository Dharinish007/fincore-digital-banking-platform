package com.fincore.BankingManagement.account.repository;

import com.fincore.BankingManagement.Entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AccoRepository extends JpaRepository<Account, String> {

    boolean existsByAccountNo(String accountNo);
}