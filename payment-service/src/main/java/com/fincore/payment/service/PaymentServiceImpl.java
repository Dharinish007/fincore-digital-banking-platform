package com.fincore.payment.service;

import com.fincore.payment.dto.PaymentRequest;
import com.fincore.payment.dto.PaymentResponse;
import com.fincore.payment.entity.Payment;
import com.fincore.payment.enums.PaymentMode;
import com.fincore.payment.enums.PaymentStatus;
import com.fincore.payment.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

  private final PaymentRepository paymentRepository;

  public PaymentServiceImpl(
    PaymentRepository paymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  @Override
  public PaymentResponse initiatePayment(
    PaymentRequest request) {

    // 1. Create payment
    Payment payment = new Payment();

    payment.setPaymentReference(
      "PAY-" + UUID.randomUUID()
        .toString()
        .substring(0, 8)
        .toUpperCase()
    );

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
      return convertToResponse(
        paymentRepository.save(payment)
      );
    }

    // 3. Fraud check
    payment.setStatus(PaymentStatus.FRAUD_CHECK);

    if (fraudCheck(request)) {
      payment.setStatus(PaymentStatus.FAILED);
      return convertToResponse(
        paymentRepository.save(payment)
      );
    }

    // 4. Process according to payment mode
    payment.setStatus(PaymentStatus.PROCESSING);

    processPayment(payment);

    // 5. Settlement
    payment.setStatus(
      PaymentStatus.SETTLEMENT_PENDING
    );

    // In this basic implementation,
    // settlement confirmation is simulated.
    payment.setStatus(PaymentStatus.SUCCESS);

    payment.setUpdatedAt(LocalDateTime.now());

    Payment savedPayment =
      paymentRepository.save(payment);

    return convertToResponse(savedPayment);
  }

  private boolean validatePayment(
    PaymentRequest request) {

    if (request.getAmount() == null) {
      return false;
    }

    if (request.getAmount().signum() <= 0) {
      return false;
    }

    if (request.getCustomerId() == null) {
      return false;
    }

    if (request.getBeneficiaryId() == null) {
      return false;
    }

    if (request.getPaymentMode() == null) {
      return false;
    }

    return true;
  }

  private boolean fraudCheck(
    PaymentRequest request) {

    /*
     * Basic placeholder.
     * Real fraud detection will be handled
     * by a separate Fraud Detection component.
     */
    return false;
  }

  private void processPayment(Payment payment) {

    PaymentMode mode =
      payment.getPaymentMode();

    switch (mode) {

      case NEFT:
        processNeft(payment);
        break;

      case IMPS:
        processImps(payment);
        break;

      case UPI:
        processUpi(payment);
        break;
    }
  }

  private void processNeft(Payment payment) {

    // NEFT processing logic / external integration
    payment.setRemarks(
      "NEFT payment processed"
    );
  }

  private void processImps(Payment payment) {

    // IMPS processing logic / external integration
    payment.setRemarks(
      "IMPS payment processed"
    );
  }

  private void processUpi(Payment payment) {

    // UPI processing logic / external integration
    payment.setRemarks(
      "UPI payment processed"
    );
  }

  @Override
  public PaymentResponse getPayment(Long id) {

    Payment payment =
      paymentRepository.findById(id)
        .orElseThrow(() ->
          new RuntimeException(
            "Payment not found: " + id
          )
        );

    return convertToResponse(payment);
  }

  @Override
  public PaymentResponse getPaymentByReference(
    String reference) {

    Payment payment =
      paymentRepository
        .findByPaymentReference(reference)
        .orElseThrow(() ->
          new RuntimeException(
            "Payment not found: "
              + reference
          )
        );

    return convertToResponse(payment);
  }

  private PaymentResponse convertToResponse(
    Payment payment) {

    PaymentResponse response =
      new PaymentResponse();

    response.setId(payment.getId());
    response.setPaymentReference(
      payment.getPaymentReference()
    );
    response.setCustomerId(
      payment.getCustomerId()
    );
    response.setBeneficiaryId(
      payment.getBeneficiaryId()
    );
    response.setAmount(
      payment.getAmount()
    );
    response.setPaymentMode(
      payment.getPaymentMode()
    );
    response.setStatus(
      payment.getStatus()
    );
    response.setRemarks(
      payment.getRemarks()
    );
    response.setCreatedAt(
      payment.getCreatedAt()
    );
    response.setUpdatedAt(
      payment.getUpdatedAt()
    );

    return response;
  }
}
