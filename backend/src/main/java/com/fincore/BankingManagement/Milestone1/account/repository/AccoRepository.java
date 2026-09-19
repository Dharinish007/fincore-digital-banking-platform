package com.fincore.BankingManagement.Milestone1.account.repository;

import com.fincore.BankingManagement.Entities.Account;
import com.fincore.BankingManagement.Entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AccoRepository extends JpaRepository<Account, String> {

    boolean existsByAccountNo(String accountNo);

    List<Account> findByCustomer(Customer customer);
}