package com.fincore.BankingManagement.account.repository;

import com.fincore.BankingManagement.Entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository  extends JpaRepository<Customer, Long> {
    boolean existsByMobileNumber(String  mobileNumber);
    boolean existsByEmail(String  email);
}
