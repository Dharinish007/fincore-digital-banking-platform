package com.fincore.BankingManagement.service;

import com.fincore.BankingManagement.dto.*;

import java.util.List;

public interface AccountService {
    AccountResponse createAccount(CreateAccountRequest request);
    List<BankAccountDto> getBalanceAccuracyAccounts();
    BankAccountDto getAccountByNo(String accountNo);
    BankAccountDto verifyAccount(String accountNo, VerifyAccountRequest request);
    BankAccountDto freezeAccount(String accountNo, FreezeAccountRequest request);
}
