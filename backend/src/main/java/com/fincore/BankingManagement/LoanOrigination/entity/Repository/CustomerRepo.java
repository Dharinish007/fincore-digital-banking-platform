package com.fincore.BankingManagement.LoanOrigination.entity.Repository;

import com.fincore.BankingManagement.CreditCheck.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, Integer> {
}
