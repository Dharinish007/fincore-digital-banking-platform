package com.fincore.BankingManagement.BankingServices.repository.TransactionRepository;

import com.fincore.BankingManagement.BankingServices.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepo extends JpaRepository<Customer,Long> {
}
