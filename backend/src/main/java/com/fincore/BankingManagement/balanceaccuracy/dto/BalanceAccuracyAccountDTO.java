package com.fincore.BankingManagement.balanceaccuracy.dto;

import java.math.BigDecimal;
import java.util.List;

public class BalanceAccuracyAccountDTO {

    private String id;
    private String accountNumber;
    private String customerName;
    private String customerId;
    private String email;
    private String phone;
    private String branch;
    private String accountType;
    private BigDecimal ledgerBalance;
    private BigDecimal availableBalance;
    private BigDecimal systemCalculatedBalance;
    private BigDecimal difference;
    private boolean balanceAccurate;
    private String status;
    private String accountStatus;
    private boolean isActive;
    private String lastVerified;
    private String remarks;
    private List<Object> pendingTransactions;
    private List<Object> debitHolds;
    private List<Object> creditHolds;
    private boolean isFrozen;
    private String kycStatus;
    private String currency;

    public BalanceAccuracyAccountDTO() {
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public BigDecimal getLedgerBalance() {
        return ledgerBalance;
    }

    public void setLedgerBalance(BigDecimal ledgerBalance) {
        this.ledgerBalance = ledgerBalance;
    }

    public BigDecimal getAvailableBalance() {
        return availableBalance;
    }

    public void setAvailableBalance(BigDecimal availableBalance) {
        this.availableBalance = availableBalance;
    }

    public BigDecimal getSystemCalculatedBalance() {
        return systemCalculatedBalance;
    }

    public void setSystemCalculatedBalance(BigDecimal systemCalculatedBalance) {
        this.systemCalculatedBalance = systemCalculatedBalance;
    }

    public BigDecimal getDifference() {
        return difference;
    }

    public void setDifference(BigDecimal difference) {
        this.difference = difference;
    }

    public boolean isBalanceAccurate() {
        return balanceAccurate;
    }

    public void setBalanceAccurate(boolean balanceAccurate) {
        this.balanceAccurate = balanceAccurate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getLastVerified() {
        return lastVerified;
    }

    public void setLastVerified(String lastVerified) {
        this.lastVerified = lastVerified;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public List<Object> getPendingTransactions() {
        return pendingTransactions;
    }

    public void setPendingTransactions(List<Object> pendingTransactions) {
        this.pendingTransactions = pendingTransactions;
    }

    public List<Object> getDebitHolds() {
        return debitHolds;
    }

    public void setDebitHolds(List<Object> debitHolds) {
        this.debitHolds = debitHolds;
    }

    public List<Object> getCreditHolds() {
        return creditHolds;
    }

    public void setCreditHolds(List<Object> creditHolds) {
        this.creditHolds = creditHolds;
    }

    public boolean isFrozen() {
        return isFrozen;
    }

    public void setFrozen(boolean frozen) {
        isFrozen = frozen;
    }

    public String getKycStatus() {
        return kycStatus;
    }

    public void setKycStatus(String kycStatus) {
        this.kycStatus = kycStatus;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
