package com.bankingapp.accountservice.service;

import com.bankingapp.accountservice.client.CustomerClient;
import com.bankingapp.accountservice.dto.*;
import com.bankingapp.accountservice.entity.Account;
import com.bankingapp.accountservice.enums.AccountStatus;
import com.bankingapp.accountservice.enums.AccountType;
import com.bankingapp.accountservice.exception.AccountOwnershipViolationException;
import com.bankingapp.accountservice.exception.CustomerNotFoundException;
import com.bankingapp.accountservice.exception.InsufficientBalanceException;
import com.bankingapp.accountservice.exception.ResourceNotFoundException;
import com.bankingapp.accountservice.repository.AccountRepository;
import com.bankingapp.accountservice.security.UserContext;
import com.bankingapp.accountservice.security.UserContextHolder;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerClient customerClient;
    private static final Logger logger = LoggerFactory.getLogger(AccountService.class);
    private final Random random = new SecureRandom();

    public AccountService(AccountRepository accountRepository, CustomerClient customerClient) {
        this.accountRepository = accountRepository;
        this.customerClient = customerClient;
    }

    public AccountResponse createAccount(AccountCreateRequest request) {
        logger.info("Creating account for customerId: {}", request.getCustomerId());

        if (request.getCustomerId() == null) {
            throw new IllegalArgumentException("Customer ID is required to create an account");
        }

        // Enforce ownership if authenticated user is a CUSTOMER
        UserContext authUser = UserContextHolder.getContext();
        if (authUser != null && authUser.isCustomer()) {
            if (authUser.getCustomerId() == null) {
                logger.warn("Customer user '{}' attempted to create account without customerId in security context", authUser.getUsername());
                throw new AccountOwnershipViolationException("Access denied: Customer identity not found in security context");
            }
            if (!authUser.getCustomerId().equals(request.getCustomerId())) {
                logger.warn("Customer {} attempted to create account for different customerId: {}",
                        authUser.getCustomerId(), request.getCustomerId());
                throw new AccountOwnershipViolationException("Customer cannot create accounts for a different customer ID: " + request.getCustomerId());
            }
        }

        // Validate that customer actually exists in Customer Service
        boolean customerExists = customerClient.existsById(request.getCustomerId());
        if (!customerExists) {
            logger.warn("Attempted to create account for non-existent customerId: {}", request.getCustomerId());
            throw new CustomerNotFoundException("Customer not found with id: " + request.getCustomerId());
        }

        Account account = new Account();
        account.setCustomerId(request.getCustomerId());
        account.setAccountType(request.getAccountType() != null ? request.getAccountType() : AccountType.SAVINGS);
        account.setAccountNumber(generateUniqueAccountNumber());
        account.setBalance(request.getInitialBalance() != null ? request.getInitialBalance() : BigDecimal.ZERO);
        account.setStatus(AccountStatus.ACTIVE);
        account.setCreatedAt(LocalDateTime.now());

        Account savedAccount = accountRepository.save(account);
        logger.info("Account created successfully with ID: {} and Account Number: {} for Customer: {}",
                savedAccount.getAccountId(), savedAccount.getAccountNumber(), savedAccount.getCustomerId());

        return mapToResponse(savedAccount);
    }

    public AccountResponse createAccount(AccountRequest request) {
        AccountCreateRequest createRequest = new AccountCreateRequest(
                request.getCustomerId(),
                request.getAccountType(),
                request.getBalance()
        );
        return createAccount(createRequest);
    }

    public AccountResponse getAccountById(Long accountId) {
        logger.info("Fetching account with ID: {}", accountId);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        // Enforce ownership if caller is CUSTOMER
        UserContext authUser = UserContextHolder.getContext();
        if (authUser != null && authUser.isCustomer()) {
            if (authUser.getCustomerId() == null || !authUser.getCustomerId().equals(account.getCustomerId())) {
                logger.warn("Customer {} attempted unauthorized access to account ID {}", authUser.getCustomerId(), accountId);
                throw new AccountOwnershipViolationException("Access denied: You do not own account ID " + accountId);
            }
        }

        return mapToResponse(account);
    }

    public AccountResponse getAccountByNumber(String accountNumber) {
        logger.info("Fetching account with number: {}", accountNumber);

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with number: " + accountNumber));

        // Enforce ownership if caller is CUSTOMER
        UserContext authUser = UserContextHolder.getContext();
        if (authUser != null && authUser.isCustomer()) {
            if (authUser.getCustomerId() == null || !authUser.getCustomerId().equals(account.getCustomerId())) {
                logger.warn("Customer {} attempted unauthorized access to account number {}", authUser.getCustomerId(), accountNumber);
                throw new AccountOwnershipViolationException("Access denied: You do not own account " + accountNumber);
            }
        }

        return mapToResponse(account);
    }

    public List<AccountResponse> getAllAccounts(Long customerId) {
        return getAllAccounts(customerId, null, null, null);
    }

    public List<AccountResponse> getAllAccounts(Long customerId, String search, AccountStatus status, AccountType accountType) {
        // Enforce customer isolation: if caller is CUSTOMER, must fail-closed and strictly bind to own identity
        UserContext authUser = UserContextHolder.getContext();
        Long effectiveCustomerId = customerId;
        if (authUser != null && authUser.isCustomer()) {
            if (authUser.getCustomerId() == null) {
                logger.warn("Customer user '{}' attempted to query accounts without customerId in security context", authUser.getUsername());
                throw new AccountOwnershipViolationException("Access denied: Customer identity not found in security context");
            }
            if (customerId != null && !customerId.equals(authUser.getCustomerId())) {
                logger.warn("Customer {} attempted to query accounts for unauthorized customerId {}",
                        authUser.getCustomerId(), customerId);
                throw new AccountOwnershipViolationException("Access denied: You cannot view accounts of another customer");
            }
            effectiveCustomerId = authUser.getCustomerId();
        }

        logger.info("Fetching accounts with filters: customerId={}, search={}, status={}, accountType={}",
                effectiveCustomerId, search, status, accountType);

        final Long finalCustomerId = effectiveCustomerId;
        Specification<Account> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (finalCustomerId != null) {
                predicates.add(cb.equal(root.get("customerId"), finalCustomerId));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (accountType != null) {
                predicates.add(cb.equal(root.get("accountType"), accountType));
            }
            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("accountNumber")), pattern));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Account> accounts = accountRepository.findAll(spec);
        logger.info("Total accounts found: {}", accounts.size());
        return accounts.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public AccountResponse updateAccount(Long accountId, AccountUpdateRequest request) {
        logger.info("Updating metadata for account ID: {}", accountId);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        UserContext authUser = UserContextHolder.getContext();
        if (authUser != null && authUser.isCustomer()) {
            if (authUser.getCustomerId() == null || !authUser.getCustomerId().equals(account.getCustomerId())) {
                throw new AccountOwnershipViolationException("Access denied: You cannot update another customer's account");
            }
        }

        if (request.getAccountType() != null) {
            account.setAccountType(request.getAccountType());
        }

        Account updatedAccount = accountRepository.save(account);
        logger.info("Account metadata updated successfully for ID: {}", accountId);

        return mapToResponse(updatedAccount);
    }

    public AccountResponse updateAccountStatus(Long accountId, AccountStatusUpdateRequest request) {
        logger.info("Updating status for account ID: {} to {}", accountId, request.getStatus());

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        UserContext authUser = UserContextHolder.getContext();
        if (authUser != null && authUser.isCustomer()) {
            throw new AccessDeniedException("Customers are not authorized to change account operational status");
        }

        account.setStatus(request.getStatus());
        Account updatedAccount = accountRepository.save(account);
        logger.info("Account status updated successfully for ID: {}", accountId);

        return mapToResponse(updatedAccount);
    }

    public void deleteAccount(Long accountId) {
        logger.info("Closing account with ID: {}", accountId);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        UserContext authUser = UserContextHolder.getContext();
        if (authUser != null && authUser.isCustomer() && authUser.getCustomerId() != null) {
            if (!authUser.getCustomerId().equals(account.getCustomerId())) {
                throw new AccountOwnershipViolationException("Access denied: You cannot close another customer's account");
            }
        }

        // Soft closure to preserve financial audit and transaction history
        account.setStatus(AccountStatus.CLOSED);
        accountRepository.save(account);

        logger.info("Account closed successfully with ID: {}", accountId);
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            long number = 1000000000L + (long) (random.nextDouble() * 9000000000L);
            accountNumber = String.valueOf(number);
        } while (accountRepository.existsByAccountNumber(accountNumber));

        return accountNumber;
    }

    private AccountResponse mapToResponse(Account account) {
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

    @Transactional
    public BigDecimal creditBalance(String accountNumber, BigDecimal amount) {
        validateAmount(amount);

        Account account = accountRepository.findByAccountNumberForUpdate(accountNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Account not found with number: " + accountNumber));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalStateException(
                    "Account is not active: " + accountNumber);
        }

        BigDecimal newBalance = account.getBalance().add(amount);
        account.setBalance(newBalance);

        accountRepository.save(account);

        return newBalance;
    }

    @Transactional
    public BigDecimal debitBalance(String accountNumber, BigDecimal amount) {
        validateAmount(amount);

        Account account = accountRepository.findByAccountNumberForUpdate(accountNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Account not found with number: " + accountNumber));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalStateException(
                    "Account is not active: " + accountNumber);
        }

        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(accountNumber);
        }

        BigDecimal newBalance = account.getBalance().subtract(amount);
        account.setBalance(newBalance);

        accountRepository.save(account);

        return newBalance;
    }

    public AccountStatisticsResponse getStatistics() {
        long totalAccounts = accountRepository.count();
        long activeAccounts = accountRepository.countByStatus(AccountStatus.ACTIVE);
        long inactiveAccounts = accountRepository.countByStatus(AccountStatus.INACTIVE);
        long blockedAccounts = accountRepository.countByStatus(AccountStatus.BLOCKED);
        long closedAccounts = accountRepository.countByStatus(AccountStatus.CLOSED);
        long savingsAccounts = accountRepository.countByAccountType(AccountType.SAVINGS);
        long currentAccounts = accountRepository.countByAccountType(AccountType.CURRENT);
        BigDecimal totalBalance = accountRepository.getTotalBalance();

        return new AccountStatisticsResponse(
                totalAccounts,
                activeAccounts,
                inactiveAccounts,
                blockedAccounts,
                closedAccounts,
                savingsAccounts,
                currentAccounts,
                totalBalance
        );
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be strictly positive");
        }
    }
}