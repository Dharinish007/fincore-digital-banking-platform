package com.fincore.BankingManagement.Payment.Repository;

import com.fincore.BankingManagement.Payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

}