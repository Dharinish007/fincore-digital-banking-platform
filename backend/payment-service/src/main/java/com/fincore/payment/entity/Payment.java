package com.fincore.payment.entity;

import com.fincore.payment.enums.PaymentMode;
import com.fincore.payment.enums.PaymentStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "payment_reference", unique = true, nullable = false)
  private String paymentReference;

  @Column(name = "customer_id", nullable = false)
  private Long customerId;

  @Column(name = "beneficiary_id", nullable = false)
  private Long beneficiaryId;

  @Column(nullable = false)
  private BigDecimal amount;

  @Enumerated(EnumType.STRING)
  @Column(name = "payment_mode", nullable = false)
  private PaymentMode paymentMode;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PaymentStatus status;

  @Column(name = "remarks")
  private String remarks;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getPaymentReference() {
    return paymentReference;
  }

  public void setPaymentReference(String paymentReference) {
    this.paymentReference = paymentReference;
  }

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

  public PaymentStatus getStatus() {
    return status;
  }

  public void setStatus(PaymentStatus status) {
    this.status = status;
  }

  public String getRemarks() {
    return remarks;
  }

  public void setRemarks(String remarks) {
    this.remarks = remarks;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
