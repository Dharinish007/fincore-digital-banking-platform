package com.fincore.BankingManagement.Payment.entity;

import jakarta.persistence.*;

import com.fincore.BankingManagement.Payment.enums.PaymentMode;
import com.fincore.BankingManagement.Payment.enums.PaymentStatus;
import com.fincore.BankingManagement.Payment.enums.PaymentType;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long payment_id;

    @Column(name = "from_account_no", nullable = false, length = 20)
    private String from_account_no;

    @Column(name = "to_account_no", nullable = false, length = 20)
    private String to_account_no;

    @Column(name = "beneficiary_id", nullable = false)
    private Long beneficiary_id;

    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type")
    private PaymentType payment_type;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_mode")
    private PaymentMode payment_mode;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus payment_status;

    @Column(name = "transaction_ref", unique = true, length = 50)
    private String transaction_ref;

    @Column(name = "description")
    private String description;

    @Column(name = "initiated_at")
    private LocalDateTime initiated_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    public Long getPayment_id() {
        return payment_id;
    }

    public void setPayment_id(Long payment_id) {
        this.payment_id = payment_id;
    }

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

    public PaymentStatus getPayment_status() {
        return payment_status;
    }

    public void setPayment_status(PaymentStatus payment_status) {
        this.payment_status = payment_status;
    }

    public String getTransaction_ref() {
        return transaction_ref;
    }

    public void setTransaction_ref(String transaction_ref) {
        this.transaction_ref = transaction_ref;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getInitiated_at() {
        return initiated_at;
    }

    public void setInitiated_at(LocalDateTime initiated_at) {
        this.initiated_at = initiated_at;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(LocalDateTime updated_at) {
        this.updated_at = updated_at;
    }
}