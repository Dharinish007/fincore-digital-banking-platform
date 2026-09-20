package com.example.imps_neft_upi_service.dto;

import com.example.imps_neft_upi_service.enums.PaymentMode;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class PaymentModeRequest {
    private String paymentReference;
    private String upiId;
    private String accountNumber;
    private String ifscCode;
    @NotNull
    @Positive
    private Long customerId;

    @NotNull
    @Positive
    private Long beneficiaryId;

    @NotNull
    @DecimalMin("1.00")
    private BigDecimal amount;

    @NotNull
    private PaymentMode paymentMode;

    private String remarks;
    public String getPaymentReference() {
    return paymentReference;
}

public void setPaymentReference(String paymentReference) {
    this.paymentReference = paymentReference;
}
public String getUpiId() {
    return upiId;
}

public void setUpiId(String upiId) {
    this.upiId = upiId;
}
public String getAccountNumber() {
    return accountNumber;
}

public void setAccountNumber(String accountNumber) {
    this.accountNumber = accountNumber;
}
public String getIfscCode() {
    return ifscCode;
}

public void setIfscCode(String ifscCode) {
    this.ifscCode = ifscCode;
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

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}