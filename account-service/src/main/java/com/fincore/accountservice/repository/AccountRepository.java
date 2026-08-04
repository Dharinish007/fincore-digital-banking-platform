package com.fincore.accountservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fincore.accountservice.entity.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {

}