package com.fincore.BankingManagement.BankingServices.repository.TransactionRepository;

import com.fincore.BankingManagement.Entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepo extends JpaRepository<Customer,Long> {
}
