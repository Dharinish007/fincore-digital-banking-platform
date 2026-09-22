package com.fincore.BankingManagement.Milestone1.account.repository;
import com.fincore.BankingManagement.Entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository  extends JpaRepository<Customer, Long> {
    boolean existsByMobileNumber(String  mobileNumber);
    boolean existsByEmail(String  email);
}
