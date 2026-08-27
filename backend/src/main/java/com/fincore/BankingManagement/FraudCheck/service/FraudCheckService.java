package com.fincore.BankingManagement.FraudCheck.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fincore.BankingManagement.FraudCheck.Repository.FraudCheckRepository;
import com.fincore.BankingManagement.FraudCheck.enums.FraudStatus;
import com.fincore.BankingManagement.FraudCheck.models.FraudCheck;
import com.fincore.BankingManagement.Payment.enums.PaymentStatus;
import com.fincore.BankingManagement.Payment.entity.Payment;
import com.fincore.BankingManagement.Payment.Repository.PaymentRepository;

@Service
public class FraudCheckService {

    private final FraudCheckRepository fraudCheckRepository;
    private final PaymentRepository paymentRepository;

    public FraudCheckService(
            FraudCheckRepository fraudCheckRepository,
            PaymentRepository paymentRepository) {

        this.fraudCheckRepository = fraudCheckRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public FraudCheck processFraudCheck(FraudCheck fraudCheck) {

        if (fraudCheck.getPayment_id() == null) {
            throw new IllegalArgumentException("Payment ID is required");
        }

        if (fraudCheck.getRisk_score() == null) {
            throw new IllegalArgumentException("Risk score is required");
        }

        if (fraudCheck.getFraud_status() == null) {
            throw new IllegalArgumentException("Fraud status is required");
        }

        Payment payment = paymentRepository
                .findById(fraudCheck.getPayment_id())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found with ID: "
                                        + fraudCheck.getPayment_id()));

        fraudCheck.setChecked_at(LocalDateTime.now());

        FraudStatus status = fraudCheck.getFraud_status();

        switch (status) {

            case Safe:
                payment.setPaymentStatus(PaymentStatus.Success);
                break;

            case Suspicious:
                payment.setPaymentStatus(PaymentStatus.Processing);
                break;

            case Blocked:
                payment.setPaymentStatus(PaymentStatus.Failed);
                break;

            case Pending:
                payment.setPaymentStatus(PaymentStatus.Processing);
                break;
        }

        payment.setUpdatedAt(LocalDateTime.now());

        paymentRepository.save(payment);

        return fraudCheckRepository.save(fraudCheck);
    }

    public FraudCheck saveFraudCheck(FraudCheck fraudCheck) {
        return fraudCheckRepository.save(fraudCheck);
    }

    public Optional<FraudCheck> getFraudCheckByPaymentId(Long paymentId) {
        return fraudCheckRepository.findByPaymentId(paymentId);
    }
}