package com.fincore.BankingManagement.Payment.dto;

import com.fincore.BankingManagement.Payment.enums.PaymentMode;
import com.fincore.BankingManagement.Payment.enums.PaymentType;

import java.math.BigDecimal;

public class PaymentRequest {

    private String from_account_no;
    private String to_account_no;
    private Long beneficiary_id;
    private BigDecimal amount;
    private PaymentType payment_type;
    private PaymentMode payment_mode;
    private String description;

    public String getFrom_account_no() {
        return from_account_no;
    }

    public void setFrom_account_no(String from_account_no) {
        this.from_account_no = from_account_no;
    }

    public String getTo_account_no() {
        return to_account_no;
    }

    public void setTo_account_no(String to_account_no) {
        this.to_account_no = to_account_no;
    }

    public Long getBeneficiary_id() {
        return beneficiary_id;
    }

    public void setBeneficiary_id(Long beneficiary_id) {
        this.beneficiary_id = beneficiary_id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentType getPayment_type() {
        return payment_type;
    }

    public void setPayment_type(PaymentType payment_type) {
        this.payment_type = payment_type;
    }

    public PaymentMode getPayment_mode() {
        return payment_mode;
    }

    public void setPayment_mode(PaymentMode payment_mode) {
        this.payment_mode = payment_mode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}