package com.fincore.payment.dto;

import com.fincore.payment.enums.PaymentMode;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class PaymentRequest {

  @NotNull(message = "Customer ID is required")
  @Positive(message = "Customer ID must be positive")
  private Long customerId;

  @NotNull(message = "Beneficiary ID is required")
  @Positive(message = "Beneficiary ID must be positive")
  private Long beneficiaryId;

  @NotNull(message = "Amount is required")
  @DecimalMin(value = "1.00", message = "Amount must be greater than zero")
  private BigDecimal amount;

  @NotNull(message = "Payment mode is required")
  private PaymentMode paymentMode;

  private String remarks;

  public Long getCustomerId() {
    return customerId;
  }

  public void setCustomerId(Long customerId) {
    this.customerId = customerId;
  }

  public Long getBeneficiaryId() {
    return beneficiaryId;
  }

  public void setBeneficiaryId(Long beneficiaryId) {
    this.beneficiaryId = beneficiaryId;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public PaymentMode getPaymentMode() {
    return paymentMode;
  }

  public void setPaymentMode(PaymentMode paymentMode) {
    this.paymentMode = paymentMode;
  }

  public String getRemarks() {
    return remarks;
  }

  public void setRemarks(String remarks) {
    this.remarks = remarks;
  }
}
