package com.fincore.BankingManagement.Milestone2.CreditCheck.entity.Repository;

import com.fincore.BankingManagement.Entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreditCheckCustomerRepo extends JpaRepository<Customer, Long> {
}
