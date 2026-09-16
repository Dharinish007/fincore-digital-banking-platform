package com.fincore.BankingManagement.Milestone2.CreditCheck.Repository;

import com.fincore.BankingManagement.Milestone2.CreditCheck.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CreditCheckCustomerRepository extends JpaRepository<Customer, Long> {
}
