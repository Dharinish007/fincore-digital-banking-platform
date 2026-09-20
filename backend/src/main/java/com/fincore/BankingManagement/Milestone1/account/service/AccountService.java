package com.fincore.BankingManagement.Milestone1.account.service;

import com.fincore.BankingManagement.Entities.Customer;
import com.fincore.BankingManagement.Entities.Account;
import com.fincore.BankingManagement.Milestone1.account.DTOs.AccountCreationRequest;
import com.fincore.BankingManagement.Milestone1.account.BankingServices.dto.AccountResponse;
import com.fincore.BankingManagement.Milestone1.account.repository.AccoRepository;
import com.fincore.BankingManagement.Milestone1.account.repository.CustomerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService {

    @Autowired
    private AccoRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // =========================================================
    // CREATE ACCOUNT
    // =========================================================

    @Transactional
    public String createAccount(AccountCreationRequest request) {

        // Check whether account number already exists
        if (accountRepository.existsByAccountNo(
                request.getAccountNo())) {

            return "Account already exists";
        }

        // Check whether email already exists
        else if (customerRepository.existsByEmail(
                request.getEmail())) {

            return "Email already exists";
        }

        // Check whether mobile number already exists
        else if (customerRepository.existsByMobileNumber(
                request.getPhone())) {

            return "Mobile number already exists";
        }

        // Create customer
        Customer savedCustomer = new Customer();

        savedCustomer.setEmail(
                request.getEmail()
        );

        savedCustomer.setFullName(
                request.getCustomerName()
        );

        savedCustomer.setMobileNumber(
                request.getPhone()
        );

        customerRepository.save(savedCustomer);

        // Create account
        Account account = new Account();

        account.setAccountNo(
                request.getAccountNo()
        );

        account.setCustomer(
                savedCustomer
        );

        account.setAccountType(
                request.getAccountType()
        );

        account.setBalance(
                request.getBalance()
        );

        account.setStatus(
                request.getStatus()
        );

        account.setBranchName(
                request.getBranchName()
        );

        account.setIfscCode(
                request.getIfscCode()
        );

        accountRepository.save(account);

        return "Account created";
    }

    // =========================================================
    // GET ACCOUNTS BY CUSTOMER
    // =========================================================

    public List<AccountResponse> getAccountsByCustomerId(
            Long customerId) {

        Customer customer = customerRepository
                .findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found with ID: "
                                        + customerId
                        ));

        return accountRepository
                .findByCustomer(customer)
                .stream()
                .map(account -> new AccountResponse(
                        customer.getCustomerId(),
                        account.getAccountNo(),
                        account.getAccountType(),
                        account.getBalance(),
                        account.getBranchName(),
                        account.getCreatedAt(),
                        account.getIfscCode(),
                        account.getStatus()
                ))
                .collect(Collectors.toList());
    }
}