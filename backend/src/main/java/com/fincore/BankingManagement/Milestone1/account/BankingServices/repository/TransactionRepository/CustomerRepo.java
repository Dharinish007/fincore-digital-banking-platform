package com.fincore.BankingManagement.Milestone1.account.BankingServices.repository.TransactionRepository;

import com.fincore.BankingManagement.Entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

@Repository("transactionCustomerRepo")
public interface CustomerRepo extends JpaRepository<Customer,Long> {
}
