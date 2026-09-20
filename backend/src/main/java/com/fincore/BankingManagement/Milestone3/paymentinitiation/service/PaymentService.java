package com.fincore.BankingManagement.Milestone3.paymentinitiation.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fincore.BankingManagement.Milestone1.account.BankingServices.TransactionService;
import com.fincore.BankingManagement.Milestone1.account.BankingServices.dto.TransferRequest;
import com.fincore.BankingManagement.Milestone3.beneficiaryverification.Repository.BeneficiaryRepository;
import com.fincore.BankingManagement.Milestone3.beneficiaryverification.models.beneficiary;
import com.fincore.BankingManagement.Milestone3.paymentinitiation.Repository.PaymentRepository;
import com.fincore.BankingManagement.Milestone3.paymentinitiation.entity.Payment;
import com.fincore.BankingManagement.Milestone3.paymentinitiation.enums.PaymentStatus;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final TransactionService transactionService;

    public PaymentService(
            PaymentRepository paymentRepository,
            BeneficiaryRepository beneficiaryRepository,
            TransactionService transactionService) {

        this.paymentRepository = paymentRepository;
        this.beneficiaryRepository = beneficiaryRepository;
        this.transactionService = transactionService;
    }

    // =========================================================
    // INITIATE PAYMENT
    // =========================================================

    @Transactional
    public Payment initiatePayment(Payment payment) {

        // -----------------------------------------------------
        // 1. Validate amount
        // -----------------------------------------------------

        if (payment.getAmount() == null ||
                payment.getAmount().signum() <= 0) {

            throw new RuntimeException(
                    "Payment amount must be greater than zero"
            );
        }

        // -----------------------------------------------------
        // 2. Validate beneficiary ID
        // -----------------------------------------------------

        if (payment.getBeneficiaryId() == null) {

            throw new RuntimeException(
                    "Beneficiary is required"
            );
        }

        // -----------------------------------------------------
        // 3. Find beneficiary
        // -----------------------------------------------------

        beneficiary ben = beneficiaryRepository
                .findById(payment.getBeneficiaryId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Beneficiary not found with ID: "
                                        + payment.getBeneficiaryId()
                        ));

        // -----------------------------------------------------
        // 4. Check beneficiary status
        // -----------------------------------------------------

        if (ben.getStatus() == null ||
                !ben.getStatus()
                        .name()
                        .equalsIgnoreCase("Verified")) {

            throw new RuntimeException(
                    "Only verified beneficiaries can receive payments"
            );
        }

        // -----------------------------------------------------
        // 5. Check beneficiary account
        // -----------------------------------------------------

        if (ben.getAccount_no() == null ||
                payment.getToAccountNo() == null ||
                !ben.getAccount_no()
                        .equals(payment.getToAccountNo())) {

            throw new RuntimeException(
                    "Receiver account does not match beneficiary account"
            );
        }

        // -----------------------------------------------------
        // 6. Check sender and receiver are different
        // -----------------------------------------------------

        if (payment.getFromAccountNo() == null ||
                payment.getToAccountNo() == null) {

            throw new RuntimeException(
                    "Sender and receiver account numbers are required"
            );
        }

        if (payment.getFromAccountNo()
                .equals(payment.getToAccountNo())) {

            throw new RuntimeException(
                    "Sender and receiver accounts cannot be the same"
            );
        }

        // -----------------------------------------------------
        // 7. Set payment status
        // -----------------------------------------------------

        payment.setPaymentStatus(
                PaymentStatus.Processing
        );

        // -----------------------------------------------------
        // 8. Generate transaction reference
        // -----------------------------------------------------

        LocalDateTime now =
                LocalDateTime.now();

        payment.setTransactionRef(
                "TXN-" +
                        now.toLocalDate()
                                .toString()
                                .replace("-", "") +
                        "-" +
                        UUID.randomUUID()
                                .toString()
                                .substring(0, 6)
                                .toUpperCase()
        );

        // -----------------------------------------------------
        // 9. Set timestamps
        // -----------------------------------------------------

        payment.setInitiatedAt(now);

        payment.setUpdatedAt(now);

        // -----------------------------------------------------
        // 10. Save payment
        // -----------------------------------------------------

        return paymentRepository.save(payment);
    }

    // =========================================================
    // PROCESS PAYMENT
    // =========================================================

    @Transactional
    public Payment processPayment(Long paymentId) {

        // -----------------------------------------------------
        // 1. Find payment
        // -----------------------------------------------------

        Payment payment = paymentRepository
                .findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found with ID: "
                                        + paymentId
                        ));

        // -----------------------------------------------------
        // 2. Payment must be Processing
        // -----------------------------------------------------

        if (payment.getPaymentStatus()
                != PaymentStatus.Processing) {

            throw new RuntimeException(
                    "Payment cannot be processed. Current status: "
                            + payment.getPaymentStatus()
            );
        }

        // -----------------------------------------------------
        // 3. Create TransferRequest
        // -----------------------------------------------------

        TransferRequest request =
                new TransferRequest();

        request.setSenderAccountNumber(
                payment.getFromAccountNo()
        );

        request.setReceiverAccountNumber(
                payment.getToAccountNo()
        );

        request.setAmount(
                payment.getAmount()
        );

        // -----------------------------------------------------
        // 4. Execute existing Milestone 1 transfer
        // -----------------------------------------------------

        try {

            transactionService
                    .transferFunds(request);

            // -------------------------------------------------
            // 5. Transfer successful
            // -------------------------------------------------

            payment.setPaymentStatus(
                    PaymentStatus.Success
            );

        } catch (Exception e) {

            // -------------------------------------------------
            // 6. Transfer failed
            // -------------------------------------------------

            payment.setPaymentStatus(
                    PaymentStatus.Failed
            );

            payment.setUpdatedAt(
                    LocalDateTime.now()
            );

            paymentRepository.save(payment);

            throw new RuntimeException(
                    "Payment processing failed: "
                            + e.getMessage(),
                    e
            );
        }

        // -----------------------------------------------------
        // 7. Update timestamp
        // -----------------------------------------------------

        payment.setUpdatedAt(
                LocalDateTime.now()
        );

        // -----------------------------------------------------
        // 8. Save final payment status
        // -----------------------------------------------------

        return paymentRepository.save(payment);
    }

    // =========================================================
    // UPDATE PAYMENT STATUS
    // =========================================================

    @Transactional
    public Payment updatePaymentStatus(
            Long paymentId,
            PaymentStatus status) {

        Payment payment =
                paymentRepository
                        .findById(paymentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found with ID: "
                                                + paymentId
                                ));

        payment.setPaymentStatus(status);

        payment.setUpdatedAt(
                LocalDateTime.now()
        );

        return paymentRepository.save(payment);
    }

    // =========================================================
    // GET PAYMENT BY ID
    // =========================================================

    public Optional<Payment> getPaymentById(
            Long paymentId) {

        return paymentRepository.findById(
                paymentId
        );
    }

    // =========================================================
    // GET PAYMENT BY TRANSACTION REFERENCE
    // =========================================================

    public Optional<Payment> getPaymentByTransactionRef(
            String transactionRef) {

        return paymentRepository
                .findByTransactionRef(transactionRef);
    }

    // =========================================================
    // GET ALL PAYMENTS
    // =========================================================

    public List<Payment> getAllPayments() {

        return paymentRepository.findAll();
    }
}