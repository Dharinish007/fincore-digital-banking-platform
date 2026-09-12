package com.fincore.payment.repository;

import com.fincore.payment.entity.Payment;
import com.fincore.payment.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository
  extends JpaRepository<Payment, Long> {

  Optional<Payment> findByPaymentReference(
    String paymentReference
  );

  List<Payment> findByCustomerId(
    Long customerId
  );

  List<Payment> findByStatus(
    PaymentStatus status
  );
}
