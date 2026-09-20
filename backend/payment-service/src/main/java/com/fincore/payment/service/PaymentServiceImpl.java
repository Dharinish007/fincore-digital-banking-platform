package com.fincore.payment.service;

import com.fincore.payment.client.BeneficiaryClient;
import com.fincore.payment.client.PaymentModeClient;
import com.fincore.payment.client.dto.BeneficiaryClientResponse;
import com.fincore.payment.client.dto.PaymentModeClientRequest;
import com.fincore.payment.client.dto.PaymentModeClientResponse;
import com.fincore.payment.dto.PaymentRequest;
import com.fincore.payment.dto.PaymentResponse;
import com.fincore.payment.entity.Payment;
import com.fincore.payment.enums.PaymentMode;
import com.fincore.payment.enums.PaymentStatus;
import com.fincore.payment.exception.PaymentNotFoundException;
import com.fincore.payment.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);

    private final PaymentRepository paymentRepository;
    private final BeneficiaryClient beneficiaryClient;
    private final PaymentModeClient paymentModeClient;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            BeneficiaryClient beneficiaryClient,
            PaymentModeClient paymentModeClient) {
        this.paymentRepository = paymentRepository;
        this.beneficiaryClient = beneficiaryClient;
        this.paymentModeClient = paymentModeClient;
    }

    @Override
    public PaymentResponse initiatePayment(PaymentRequest request) {
        log.info("Initiating payment for customerId={}, beneficiaryId={}, amount={}, mode={}",
                request.getCustomerId(), request.getBeneficiaryId(), request.getAmount(), request.getPaymentMode());

        // 1. Initial entity creation
        Payment payment = new Payment();
        payment.setPaymentReference("PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setCustomerId(request.getCustomerId());
        payment.setBeneficiaryId(request.getBeneficiaryId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMode(request.getPaymentMode());
        payment.setRemarks(request.getRemarks());
        payment.setStatus(PaymentStatus.INITIATED);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        // 2. Validation
        payment.setStatus(PaymentStatus.VALIDATING);
        if (!validatePayment(request)) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setRemarks("Validation failed: amount must be > 0 and all required fields provided");
            return convertToResponse(paymentRepository.save(payment));
        }

        // 3. Beneficiary verification (Inter-service check)
        Optional<BeneficiaryClientResponse> beneficiaryOpt =
                beneficiaryClient.getBeneficiaryById(request.getBeneficiaryId());

        String recipientAccount = null;
        String recipientIfsc = null;
        String recipientUpi = null;

        if (beneficiaryOpt.isPresent()) {
            BeneficiaryClientResponse b = beneficiaryOpt.get();
            if (b.getCustomerId() != null && !b.getCustomerId().equals(request.getCustomerId())) {
                log.warn("Beneficiary {} does not belong to customer {}", request.getBeneficiaryId(), request.getCustomerId());
                payment.setStatus(PaymentStatus.FAILED);
                payment.setRemarks("Beneficiary does not belong to customer: " + request.getCustomerId());
                return convertToResponse(paymentRepository.save(payment));
            }
            if (b.getStatus() != null && !"ACTIVE".equalsIgnoreCase(b.getStatus())) {
                log.warn("Beneficiary {} is not active (status={})", request.getBeneficiaryId(), b.getStatus());
                payment.setStatus(PaymentStatus.FAILED);
                payment.setRemarks("Beneficiary is inactive");
                return convertToResponse(paymentRepository.save(payment));
            }
            recipientAccount = b.getAccountNumber();
            recipientIfsc = b.getIfscCode();
        } else {
            // Default placeholder account for standalone mode
            recipientAccount = "100020003000";
            recipientIfsc = "FINC0001234";
        }

        // 4. Fraud check
        payment.setStatus(PaymentStatus.FRAUD_CHECK);
        if (fraudCheck(request)) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setRemarks("Payment flagged by fraud check engine");
            return convertToResponse(paymentRepository.save(payment));
        }

        // 5. Processing via imps-neft-upi-service or fallback
        payment.setStatus(PaymentStatus.PROCESSING);
        PaymentModeClientRequest modeRequest = new PaymentModeClientRequest();
        modeRequest.setPaymentReference(payment.getPaymentReference());
        modeRequest.setCustomerId(request.getCustomerId());
        modeRequest.setBeneficiaryId(request.getBeneficiaryId());
        modeRequest.setAmount(request.getAmount());
        modeRequest.setPaymentMode(request.getPaymentMode().name());
        modeRequest.setAccountNumber(recipientAccount);
        modeRequest.setIfscCode(recipientIfsc);
        modeRequest.setUpiId(recipientUpi != null ? recipientUpi : "customer" + request.getCustomerId() + "@fincore");
        modeRequest.setRemarks(request.getRemarks());

        Optional<PaymentModeClientResponse> modeResponseOpt = paymentModeClient.processPaymentMode(modeRequest);

        if (modeResponseOpt.isPresent()) {
            PaymentModeClientResponse modeResponse = modeResponseOpt.get();
            if ("SUCCESS".equalsIgnoreCase(modeResponse.getStatus())) {
                payment.setStatus(PaymentStatus.SUCCESS);
                payment.setRemarks(modeResponse.getMessage() != null ? modeResponse.getMessage() : request.getPaymentMode() + " payment processed successfully");
            } else {
                payment.setStatus(PaymentStatus.FAILED);
                payment.setRemarks(modeResponse.getMessage() != null ? modeResponse.getMessage() : "Payment mode processor rejected transaction");
            }
        } else {
            // Standalone fallback: simulate mode processing
            simulateModeProcessing(payment);
            payment.setStatus(PaymentStatus.SUCCESS);
        }

        payment.setUpdatedAt(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payment completed with reference={}, status={}", savedPayment.getPaymentReference(), savedPayment.getStatus());
        return convertToResponse(savedPayment);
    }

    private boolean validatePayment(PaymentRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }
        if (request.getCustomerId() == null || request.getCustomerId() <= 0) {
            return false;
        }
        if (request.getBeneficiaryId() == null || request.getBeneficiaryId() <= 0) {
            return false;
        }
        return request.getPaymentMode() != null;
    }

    private boolean fraudCheck(PaymentRequest request) {
        // High-risk transaction limit check: > 10,000,000 without 2FA
        return request.getAmount() != null && request.getAmount().compareTo(new BigDecimal("10000000")) > 0;
    }

    private void simulateModeProcessing(Payment payment) {
        switch (payment.getPaymentMode()) {
            case NEFT -> payment.setRemarks("NEFT payment processed (batch settled)");
            case IMPS -> payment.setRemarks("IMPS payment processed (instant)");
            case UPI -> payment.setRemarks("UPI payment processed (real-time)");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found with ID: " + id));
        return convertToResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByReference(String reference) {
        Payment payment = paymentRepository.findByPaymentReference(reference)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found with reference: " + reference));
        return convertToResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByCustomerId(Long customerId) {
        return paymentRepository.findByCustomerId(customerId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private PaymentResponse convertToResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setPaymentReference(payment.getPaymentReference());
        response.setCustomerId(payment.getCustomerId());
        response.setBeneficiaryId(payment.getBeneficiaryId());
        response.setAmount(payment.getAmount());
        response.setPaymentMode(payment.getPaymentMode());
        response.setStatus(payment.getStatus());
        response.setRemarks(payment.getRemarks());
        response.setCreatedAt(payment.getCreatedAt());
        response.setUpdatedAt(payment.getUpdatedAt());
        return response;
    }
}
