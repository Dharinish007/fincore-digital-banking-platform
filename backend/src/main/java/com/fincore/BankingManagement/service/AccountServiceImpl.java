package com.fincore.BankingManagement.service;

import com.fincore.BankingManagement.dto.*;
import com.fincore.BankingManagement.exception.ResourceNotFoundException;
import com.fincore.BankingManagement.model.Account;
import com.fincore.BankingManagement.model.AuditLog;
import com.fincore.BankingManagement.model.Customer;
import com.fincore.BankingManagement.repository.AccountRepository;
import com.fincore.BankingManagement.repository.AuditLogRepository;
import com.fincore.BankingManagement.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {
        Customer customer = new Customer();
        customer.setFullName(request.getFullname());
        customer.setEmail(request.getEmail());
        customer.setMobileNumber(request.getMobile());
        customer.setAddress(request.getAddress());
        customer.setOccupation(request.getOccupation());
        customer.setAnnualIncome(request.getIncome());
        customer.setPanNumber(request.getPan());
        customer.setAadhaarNumber(request.getAadhaar());
        customer = customerRepository.save(customer);

        String generatedAccNo = "ACC-" + (10000000 + new Random().nextInt(90000000));
        Account account = new Account();
        account.setAccountNo(generatedAccNo);
        account.setCustomer(customer);
        account.setAccountType(request.getAccountType());
        account.setBalance(request.getInitialDeposit() != null ? request.getInitialDeposit() : BigDecimal.ZERO);
        account.setAvailableBalance(account.getBalance());
        account.setSystemCalculatedBalance(account.getBalance());
        account.setDifference(BigDecimal.ZERO);
        account.setStatus("Verified");
        account.setBranchName(request.getBranch());
        account.setIfscCode("FINC0001002");
        account.setLastVerified(LocalDateTime.now());
        account = accountRepository.save(account);

        // Record Audit Log
        AuditLog log = new AuditLog();
        log.setAccountNo(generatedAccNo);
        log.setLogLevel("INFO");
        log.setEventAction("ACCOUNT_CREATED");
        log.setPerformedBy("SYSTEM");
        log.setRemarks("New " + request.getAccountType() + " account created for " + request.getFullname());
        auditLogRepository.save(log);

        return AccountResponse.builder()
                .accountNumber(generatedAccNo)
                .customerId(customer.getCustomerId())
                .customerName(customer.getFullName())
                .email(customer.getEmail())
                .mobile(customer.getMobileNumber())
                .branch(account.getBranchName())
                .accountType(account.getAccountType())
                .initialDeposit(account.getBalance())
                .status(account.getStatus())
                .createdAt(account.getCreatedAt() != null ? account.getCreatedAt().toString() : LocalDateTime.now().toString())
                .build();
    }

    @Override
    public List<BankAccountDto> getBalanceAccuracyAccounts() {
        List<Account> accounts = accountRepository.findAll();

        if (accounts.isEmpty()) {
            // Seed sample balance accuracy accounts if empty
            seedSampleAccounts();
            accounts = accountRepository.findAll();
        }

        List<BankAccountDto> dtos = new ArrayList<>();
        for (Account acc : accounts) {
            dtos.add(mapToBankAccountDto(acc));
        }
        return dtos;
    }

    @Override
    public BankAccountDto getAccountByNo(String accountNo) {
        Account acc = accountRepository.findByAccountNo(accountNo)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with number: " + accountNo));
        return mapToBankAccountDto(acc);
    }

    @Override
    @Transactional
    public BankAccountDto verifyAccount(String accountNo, VerifyAccountRequest request) {
        Account acc = accountRepository.findByAccountNo(accountNo)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with number: " + accountNo));

        acc.setStatus("Verified");
        acc.setSystemCalculatedBalance(acc.getBalance());
        acc.setDifference(BigDecimal.ZERO);
        acc.setLastVerified(LocalDateTime.now());
        acc = accountRepository.save(acc);

        AuditLog log = new AuditLog();
        log.setAccountNo(accountNo);
        log.setLogLevel("SUCCESS");
        log.setEventAction("ACCOUNT_VERIFIED");
        log.setPerformedBy("AUDITOR");
        log.setRemarks(request != null && request.getRemarks() != null ? request.getRemarks() : "Manual verification approved by auditor.");
        auditLogRepository.save(log);

        return mapToBankAccountDto(acc);
    }

    @Override
    @Transactional
    public BankAccountDto freezeAccount(String accountNo, FreezeAccountRequest request) {
        Account acc = accountRepository.findByAccountNo(accountNo)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with number: " + accountNo));

        acc.setStatus("Blocked");
        acc = accountRepository.save(acc);

        AuditLog log = new AuditLog();
        log.setAccountNo(accountNo);
        log.setLogLevel("WARN");
        log.setEventAction("ACCOUNT_FROZEN");
        log.setPerformedBy("COMPLIANCE");
        log.setRemarks(request != null && request.getReason() != null ? request.getReason() : "Account temporarily frozen due to compliance discrepancy.");
        auditLogRepository.save(log);

        return mapToBankAccountDto(acc);
    }

    private BankAccountDto mapToBankAccountDto(Account acc) {
        String lastVerifiedStr = acc.getLastVerified() != null
                ? acc.getLastVerified().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        return BankAccountDto.builder()
                .id(acc.getAccountNo())
                .accountNumber(acc.getAccountNo())
                .customerName(acc.getCustomer() != null ? acc.getCustomer().getFullName() : "N/A")
                .customerId(acc.getCustomer() != null ? String.valueOf(acc.getCustomer().getCustomerId()) : "N/A")
                .branch(acc.getBranchName())
                .accountType(acc.getAccountType())
                .ledgerBalance(acc.getBalance())
                .availableBalance(acc.getAvailableBalance())
                .systemCalculatedBalance(acc.getSystemCalculatedBalance())
                .difference(acc.getDifference())
                .status(acc.getStatus())
                .lastVerified(lastVerifiedStr)
                .build();
    }

    private void seedSampleAccounts() {
        Customer c1 = customerRepository.save(new Customer(null, "Aditi Verma", "aditi.verma@example.com", "9876543210", "Main St", "Software Engineer", new BigDecimal("1200000"), "ABCDE1234F", "123456789012", LocalDateTime.now()));
        Customer c2 = customerRepository.save(new Customer(null, "Rahul Sharma", "rahul.sharma@example.com", "9812345678", "Park St", "Manager", new BigDecimal("1500000"), "BCDEF2345G", "234567890123", LocalDateTime.now()));
        Customer c3 = customerRepository.save(new Customer(null, "Priya Nair", "priya.nair@example.com", "9700012345", "MG Road", "Consultant", new BigDecimal("1800000"), "CDEFG3456H", "345678901234", LocalDateTime.now()));

        accountRepository.save(new Account("100084920192", c1, "Savings", new BigDecimal("128475.00"), new BigDecimal("128475.00"), new BigDecimal("128475.00"), BigDecimal.ZERO, "Verified", "Main Branch - Downtown", "FINC0001001", LocalDateTime.now(), LocalDateTime.now()));
        accountRepository.save(new Account("400092817261", c2, "Corporate", new BigDecimal("450000.00"), new BigDecimal("450000.00"), new BigDecimal("448800.00"), new BigDecimal("1200.00"), "Mismatch", "Westside Metro", "FINC0001002", LocalDateTime.now(), LocalDateTime.now()));
        accountRepository.save(new Account("200039102938", c3, "Checking", new BigDecimal("86000.00"), new BigDecimal("86000.00"), new BigDecimal("86000.00"), BigDecimal.ZERO, "Verified", "East Commerce", "FINC0001003", LocalDateTime.now(), LocalDateTime.now()));
    }
}
