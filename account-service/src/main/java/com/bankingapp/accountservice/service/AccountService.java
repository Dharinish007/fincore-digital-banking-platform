package com.bankingapp.accountservice.service;

import com.bankingapp.accountservice.dto.AccountRequest;
import com.bankingapp.accountservice.dto.AccountResponse;
import com.bankingapp.accountservice.entity.Account;
import com.bankingapp.accountservice.exception.ResourceNotFoundException;
import com.bankingapp.accountservice.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    private static final Logger logger =
            LoggerFactory.getLogger(AccountService.class);

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public AccountResponse createAccount(AccountRequest request) {

        logger.info("Creating account for customerId: {}", request.getCustomerId());

        Account account = new Account();

        account.setCustomerId(request.getCustomerId());
        account.setAccountNumber(request.getAccountNumber());
        account.setAccountType(request.getAccountType());
        account.setBalance(request.getBalance());
        account.setStatus(request.getStatus());
        account.setCreatedAt(LocalDateTime.now());

        Account savedAccount = accountRepository.save(account);

        logger.info("Account created successfully with ID: {}", savedAccount.getAccountId());

        AccountResponse response = new AccountResponse();

        response.setAccountId(savedAccount.getAccountId());
        response.setCustomerId(savedAccount.getCustomerId());
        response.setAccountNumber(savedAccount.getAccountNumber());
        response.setAccountType(savedAccount.getAccountType());
        response.setBalance(savedAccount.getBalance());
        response.setStatus(savedAccount.getStatus());
        response.setCreatedAt(savedAccount.getCreatedAt());

        return response;
    }

    public AccountResponse getAccountById(Long accountId) {

        logger.info("Fetching account with ID: {}", accountId);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found with id: " + accountId));

        logger.info("Account found with ID: {}", accountId);

        AccountResponse response = new AccountResponse();

        response.setAccountId(account.getAccountId());
        response.setCustomerId(account.getCustomerId());
        response.setAccountNumber(account.getAccountNumber());
        response.setAccountType(account.getAccountType());
        response.setBalance(account.getBalance());
        response.setStatus(account.getStatus());
        response.setCreatedAt(account.getCreatedAt());

        return response;
    }

    public List<AccountResponse> getAllAccounts() {

        logger.info("Fetching all accounts");

        List<Account> accounts = accountRepository.findAll();

        logger.info("Total accounts found: {}", accounts.size());

        List<AccountResponse> responses = new ArrayList<>();

        for (Account account : accounts) {

            AccountResponse response = new AccountResponse();

            response.setAccountId(account.getAccountId());
            response.setCustomerId(account.getCustomerId());
            response.setAccountNumber(account.getAccountNumber());
            response.setAccountType(account.getAccountType());
            response.setBalance(account.getBalance());
            response.setStatus(account.getStatus());
            response.setCreatedAt(account.getCreatedAt());

            responses.add(response);
        }

        return responses;
    }

    public AccountResponse updateAccount(Long accountId, AccountRequest request) {

        logger.info("Updating account with ID: {}", accountId);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found with id: " + accountId));

        account.setCustomerId(request.getCustomerId());
        account.setAccountType(request.getAccountType());
        account.setBalance(request.getBalance());
        account.setStatus(request.getStatus());

        Account updatedAccount = accountRepository.save(account);

        logger.info("Account updated successfully with ID: {}", accountId);

        AccountResponse response = new AccountResponse();

        response.setAccountId(updatedAccount.getAccountId());
        response.setCustomerId(updatedAccount.getCustomerId());
        response.setAccountNumber(updatedAccount.getAccountNumber());
        response.setAccountType(updatedAccount.getAccountType());
        response.setBalance(updatedAccount.getBalance());
        response.setStatus(updatedAccount.getStatus());
        response.setCreatedAt(updatedAccount.getCreatedAt());

        return response;
    }

    public void deleteAccount(Long accountId) {

        logger.info("Deleting account with ID: {}", accountId);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found with id: " + accountId));

        accountRepository.delete(account);

        logger.info("Account deleted successfully with ID: {}", accountId);

    }
}