package com.fincore.BankingManagement.account.service;

import com.fincore.BankingManagement.BankingServices.model.Customer;
import com.fincore.BankingManagement.BankingServices.repository.TransactionRepository.CustomerRepo;
import com.fincore.BankingManagement.Entities.Account;
import com.fincore.BankingManagement.account.DTOs.AccountCreationRequest;
import com.fincore.BankingManagement.account.repository.AccoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class AccountService {

    @Autowired
    private AccoRepository accountRepository;
    @Autowired
    private CustomerRepo customerRepository;

    @Transactional
    public Account createAccount(AccountCreationRequest request) {

        // Check whether account number already exists
        if (accountRepository.existsByAccountNo(request.getAccountNo())) {
            throw new RuntimeException("Account already exists");
        }

        Customer SavedCustomer = new Customer();
        SavedCustomer.setEmail(request.getEmail());
        SavedCustomer.setFullName(request.getCustomerName());
        SavedCustomer.setMobileNumber(request.getPhone());
        customerRepository.save(SavedCustomer);
        System.out.println("Customer saved: " + SavedCustomer.getFullName());

        Account account = new Account();
        account.setAccountNo(request.getAccountNo());
        account.setCustomer(SavedCustomer);
        account.setAccountType(request.getAccountType());
        account.setBalance(request.getBalance());
        account.setStatus(request.getStatus());
        account.setBranchName(request.getBranchName());
        account.setIfscCode(request.getIfscCode());
        accountRepository.save(account);
        return  account;
    }
}