package com.fincore.BankingManagement.FraudCheck.models;

import java.time.LocalDateTime;

import com.fincore.BankingManagement.FraudCheck.enums.FraudStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "fraud_check")
public class FraudCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fraud_check_id;

    @Column(name = "payment_id", nullable = false, unique = true)
    private Long payment_id;

    @Column(name = "risk_score", nullable = false)
    private Integer risk_score;

    @Enumerated(EnumType.STRING)
    @Column(name = "fraud_status")
    private FraudStatus fraud_status;

    @Column(name = "rule_triggered")
    private String rule_triggered;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "checked_at")
    private LocalDateTime checked_at;

    public Long getFraud_check_id() {
        return fraud_check_id;
    }

    public void setFraud_check_id(Long fraud_check_id) {
        this.fraud_check_id = fraud_check_id;
    }

    public Long getPayment_id() {
        return payment_id;
    }

    public void setPayment_id(Long payment_id) {
        this.payment_id = payment_id;
    }

    public Integer getRisk_score() {
        return risk_score;
    }

    public void setRisk_score(Integer risk_score) {
        this.risk_score = risk_score;
    }

    public FraudStatus getFraud_status() {
        return fraud_status;
    }

    public void setFraud_status(FraudStatus fraud_status) {
        this.fraud_status = fraud_status;
    }

    public String getRule_triggered() {
        return rule_triggered;
    }

    public void setRule_triggered(String rule_triggered) {
        this.rule_triggered = rule_triggered;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getChecked_at() {
        return checked_at;
    }

    public void setChecked_at(LocalDateTime checked_at) {
        this.checked_at = checked_at;
    }
}