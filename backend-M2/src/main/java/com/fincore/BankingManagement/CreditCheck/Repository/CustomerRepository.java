package com.fincore.BankingManagement.CreditCheck.Repository;

import com.fincore.BankingManagement.CreditCheck.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
