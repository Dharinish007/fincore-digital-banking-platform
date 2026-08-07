package com.fincore.BankingManagement.repository;

import com.fincore.BankingManagement.model.Account;
import com.fincore.BankingManagement.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByAccountNo(String accountNo);
    List<Account> findByCustomer(Customer customer);
}
