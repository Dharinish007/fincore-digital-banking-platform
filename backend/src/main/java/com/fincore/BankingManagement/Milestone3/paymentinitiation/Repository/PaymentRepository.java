package com.fincore.BankingManagement.Milestone3.paymentinitiation.Repository;

import com.fincore.BankingManagement.Milestone3.paymentinitiation.entity.Payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByTransactionRef(String transactionRef);

}