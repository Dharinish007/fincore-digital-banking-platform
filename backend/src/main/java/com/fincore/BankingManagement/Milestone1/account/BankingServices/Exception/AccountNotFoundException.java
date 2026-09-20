package com.fincore.BankingManagement.Milestone1.account.BankingServices.Exception;

public class AccountNotFoundException extends RuntimeException {

    public AccountNotFoundException(String message) {
        super(message);
    }
}