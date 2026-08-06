package com.fincore.BankingManagement.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fincore.BankingManagement.account.entity.Account;
import org.springframework.stereotype.Repository;

@Repository
public interface AccoRepository extends JpaRepository<Account, String> {

}