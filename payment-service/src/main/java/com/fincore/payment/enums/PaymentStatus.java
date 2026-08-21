package com.fincore.payment.enums;

public enum PaymentStatus {

  INITIATED,
  VALIDATING,
  FRAUD_CHECK,
  PROCESSING,
  SETTLEMENT_PENDING,
  SUCCESS,
  FAILED
}
