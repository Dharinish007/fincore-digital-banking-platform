package com.fincore.BankingManagement.account.service;

import com.fincore.BankingManagement.Entities.Customer;
import com.fincore.BankingManagement.BankingServices.repository.TransactionRepository.CustomerRepo;
import com.fincore.BankingManagement.Entities.Account;
import com.fincore.BankingManagement.account.DTOs.AccountCreationRequest;
import com.fincore.BankingManagement.account.repository.AccoRepository;
import com.fincore.BankingManagement.account.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class AccountService {

    @Autowired
    private AccoRepository accountRepository;
    @Autowired
    private CustomerRepository customerRepository;

    @Transactional
    public String createAccount(AccountCreationRequest request) {

        // Check whether account number already exists
        if (accountRepository.existsByAccountNo(request.getAccountNo())) {
            return "Account already exists";
        }
       else if(customerRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }
       else if(customerRepository.existsByMobileNumber(request.getPhone())){
           return "Mobile number already exists";
        }
        Customer SavedCustomer = new Customer();
        SavedCustomer.setEmail(request.getEmail());
        SavedCustomer.setFullName(request.getCustomerName());
        SavedCustomer.setMobileNumber(request.getPhone());
        customerRepository.save(SavedCustomer);
        Account account = new Account();
        account.setAccountNo(request.getAccountNo());
        account.setCustomer(SavedCustomer);
        account.setAccountType(request.getAccountType());
        account.setBalance(request.getBalance());
        account.setStatus(request.getStatus());
        account.setBranchName(request.getBranchName());
        account.setIfscCode(request.getIfscCode());
        accountRepository.save(account);
        return "Account created";
    }
}