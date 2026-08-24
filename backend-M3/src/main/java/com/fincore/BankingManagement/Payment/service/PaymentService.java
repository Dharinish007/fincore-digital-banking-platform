package com.fincore.BankingManagement.Payment.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fincore.BankingManagement.Payment.Repository.PaymentRepository;
import com.fincore.BankingManagement.Payment.entity.Payment;
import com.fincore.BankingManagement.Payment.enums.PaymentStatus;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public Payment initiatePayment(Payment payment) {

        LocalDateTime now = LocalDateTime.now();

        payment.setPaymentStatus(PaymentStatus.Success);

        payment.setTransactionRef(
                "TXN-" +
                now.toLocalDate().toString().replace("-", "") +
                "-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 6)
                        .toUpperCase()
        );

        payment.setInitiatedAt(now);
        payment.setUpdatedAt(now);

        return paymentRepository.save(payment);
    }

    public Optional<Payment> getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId);
    }

    public Optional<Payment> getPaymentByTransactionRef(String transactionRef) {
        return paymentRepository.findByTransactionRef(transactionRef);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}