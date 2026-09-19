package com.fincore.BankingManagement.Milestone3.fraudcheck.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.fincore.BankingManagement.Milestone3.fraudcheck.Repository.FraudCheckRepository;
import com.fincore.BankingManagement.Milestone3.fraudcheck.enums.FraudStatus;
import com.fincore.BankingManagement.Milestone3.fraudcheck.models.FraudCheck;
import com.fincore.BankingManagement.Milestone3.paymentinitiation.enums.PaymentStatus;
import com.fincore.BankingManagement.Milestone3.paymentinitiation.entity.Payment;
import com.fincore.BankingManagement.Milestone3.paymentinitiation.Repository.PaymentRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

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


    // =========================================================
    // PROCESS FRAUD CHECK
    // =========================================================

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

        FraudStatus status =
                fraudCheck.getFraud_status();

        switch (status) {

            case Safe:
                payment.setPaymentStatus(
                        PaymentStatus.Success
                );
                break;

            case Suspicious:
                payment.setPaymentStatus(
                        PaymentStatus.Processing
                );
                break;

            case Blocked:
                payment.setPaymentStatus(
                        PaymentStatus.Failed
                );
                break;

            case Pending:
                payment.setPaymentStatus(
                        PaymentStatus.Processing
                );
                break;
        }

        payment.setUpdatedAt(
                LocalDateTime.now()
        );

        paymentRepository.save(payment);

        return fraudCheckRepository.save(fraudCheck);
    }


    // =========================================================
    // SAVE FRAUD CHECK
    // =========================================================

    public FraudCheck saveFraudCheck(
            FraudCheck fraudCheck) {

        return fraudCheckRepository.save(
                fraudCheck
        );
    }


    // =========================================================
    // GET ALL FRAUD CHECKS
    // =========================================================

    public List<FraudCheck> getAllFraudChecks() {

        return fraudCheckRepository.findAll();
    }


    // =========================================================
    // GET PENDING FRAUD CHECKS
    // =========================================================

    public List<FraudCheck> getPendingFraudChecks() {

        return fraudCheckRepository
                .findByFraudStatus(FraudStatus.Pending);
    }


    // =========================================================
    // GET BY PAYMENT ID
    // =========================================================

    public Optional<FraudCheck> getFraudCheckByPaymentId(
            Long paymentId) {

        return fraudCheckRepository
                .findByPaymentId(paymentId);
    }


    // =========================================================
    // MARK SAFE
    // =========================================================

    @Transactional
    public FraudCheck markSafe(
            Long fraudCheckId,
            String remarks) {

        FraudCheck fraudCheck =
                fraudCheckRepository
                        .findById(fraudCheckId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Fraud check not found with ID: "
                                                + fraudCheckId
                                )
                        );

        fraudCheck.setFraud_status(
                FraudStatus.Safe
        );

        if (remarks != null &&
                !remarks.trim().isEmpty()) {

            fraudCheck.setRemarks(
                    remarks
            );
        }

        fraudCheck.setChecked_at(
                LocalDateTime.now()
        );


        // Update payment status
        if (fraudCheck.getPayment_id() != null) {

            Payment payment =
                    paymentRepository
                            .findById(
                                    fraudCheck.getPayment_id()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Payment not found with ID: "
                                                    + fraudCheck.getPayment_id()
                                    )
                            );

            payment.setPaymentStatus(
                    PaymentStatus.Success
            );

            payment.setUpdatedAt(
                    LocalDateTime.now()
            );

            paymentRepository.save(payment);
        }

        return fraudCheckRepository.save(
                fraudCheck
        );
    }


    // =========================================================
    // MARK SUSPICIOUS
    // =========================================================

    @Transactional
    public FraudCheck markSuspicious(
            Long fraudCheckId,
            String remarks) {

        FraudCheck fraudCheck =
                fraudCheckRepository
                        .findById(fraudCheckId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Fraud check not found with ID: "
                                                + fraudCheckId
                                )
                        );

        fraudCheck.setFraud_status(
                FraudStatus.Suspicious
        );

        if (remarks != null &&
                !remarks.trim().isEmpty()) {

            fraudCheck.setRemarks(
                    remarks
            );
        }

        fraudCheck.setChecked_at(
                LocalDateTime.now()
        );


        // Keep payment in processing
        if (fraudCheck.getPayment_id() != null) {

            Payment payment =
                    paymentRepository
                            .findById(
                                    fraudCheck.getPayment_id()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Payment not found with ID: "
                                                    + fraudCheck.getPayment_id()
                                    )
                            );

            payment.setPaymentStatus(
                    PaymentStatus.Processing
            );

            payment.setUpdatedAt(
                    LocalDateTime.now()
            );

            paymentRepository.save(payment);
        }

        return fraudCheckRepository.save(
                fraudCheck
        );
    }


    // =========================================================
    // BLOCK TRANSACTION
    // =========================================================

    @Transactional
    public FraudCheck blockTransaction(
            Long fraudCheckId,
            String remarks) {

        FraudCheck fraudCheck =
                fraudCheckRepository
                        .findById(fraudCheckId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Fraud check not found with ID: "
                                                + fraudCheckId
                                )
                        );

        fraudCheck.setFraud_status(
                FraudStatus.Blocked
        );

        if (remarks != null &&
                !remarks.trim().isEmpty()) {

            fraudCheck.setRemarks(
                    remarks
            );
        }

        fraudCheck.setChecked_at(
                LocalDateTime.now()
        );


        // Mark payment as failed
        if (fraudCheck.getPayment_id() != null) {

            Payment payment =
                    paymentRepository
                            .findById(
                                    fraudCheck.getPayment_id()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Payment not found with ID: "
                                                    + fraudCheck.getPayment_id()
                                    )
                            );

            payment.setPaymentStatus(
                    PaymentStatus.Failed
            );

            payment.setUpdatedAt(
                    LocalDateTime.now()
            );

            paymentRepository.save(payment);
        }

        return fraudCheckRepository.save(
                fraudCheck
        );
    }
}