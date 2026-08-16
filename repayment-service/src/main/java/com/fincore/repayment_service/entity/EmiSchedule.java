package com.fincore.repayment_service.entity;
import java.math.BigDecimal;
import java.time.LocalDate;


import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "emi_schedule")
@Data
public class EmiSchedule {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "loanid")
	private Long id;
   
	@Column(name = "loan_id")
	private Long loanId;

    private Integer emiNumber;

    private LocalDate dueDate;

    private BigDecimal emiAmount;

    private BigDecimal paidAmount;

    private BigDecimal remainingAmount;

    private String paymentStatus;

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getLoanId() {
		return loanId;
	}

	public void setLoanId(Long loanId) {
		this.loanId = loanId;
	}

	public Integer getEmiNumber() {
		return emiNumber;
	}

	public void setEmiNumber(Integer emiNumber) {
		this.emiNumber = emiNumber;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}

	public BigDecimal getEmiAmount() {
		return emiAmount;
	}

	public void setEmiAmount(BigDecimal emiAmount) {
		this.emiAmount = emiAmount;
	}

	public BigDecimal getPaidAmount() {
		return paidAmount;
	}

	public void setPaidAmount(BigDecimal paidAmount) {
		this.paidAmount = paidAmount;
	}

	public BigDecimal getRemainingAmount() {
		return remainingAmount;
	}

	public void setRemainingAmount(BigDecimal remainingAmount) {
		this.remainingAmount = remainingAmount;
	}

	public String getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(String paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public Integer getOverdueDays() {
		return overdueDays;
	}

	public void setOverdueDays(Integer overdueDays) {
		this.overdueDays = overdueDays;
	}

	public BigDecimal getLateCharges() {
		return lateCharges;
	}

	public void setLateCharges(BigDecimal lateCharges) {
		this.lateCharges = lateCharges;
	}

	private Integer overdueDays;

    private BigDecimal lateCharges;
}
