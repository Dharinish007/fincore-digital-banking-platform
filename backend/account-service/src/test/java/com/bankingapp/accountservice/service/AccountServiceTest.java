package com.bankingapp.accountservice.service;

import com.bankingapp.accountservice.client.CustomerClient;
import com.bankingapp.accountservice.dto.AccountCreateRequest;
import com.bankingapp.accountservice.dto.AccountResponse;
import com.bankingapp.accountservice.dto.AccountStatusUpdateRequest;
import com.bankingapp.accountservice.dto.AccountUpdateRequest;
import com.bankingapp.accountservice.entity.Account;
import com.bankingapp.accountservice.enums.AccountStatus;
import com.bankingapp.accountservice.enums.AccountType;
import com.bankingapp.accountservice.exception.AccountOwnershipViolationException;
import com.bankingapp.accountservice.exception.CustomerNotFoundException;
import com.bankingapp.accountservice.exception.ResourceNotFoundException;
import com.bankingapp.accountservice.repository.AccountRepository;
import com.bankingapp.accountservice.security.UserContext;
import com.bankingapp.accountservice.security.UserContextHolder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private CustomerClient customerClient;

    @InjectMocks
    private AccountService accountService;

    private Account mockAccount;

    @BeforeEach
    void setUp() {
        mockAccount = new Account();
        mockAccount.setAccountId(1L);
        mockAccount.setCustomerId(100L);
        mockAccount.setAccountNumber("1234567890");
        mockAccount.setAccountType(AccountType.SAVINGS);
        mockAccount.setBalance(new BigDecimal("1500.00"));
        mockAccount.setStatus(AccountStatus.ACTIVE);
        mockAccount.setCreatedAt(LocalDateTime.now());
    }

    @AfterEach
    void tearDown() {
        UserContextHolder.clear();
    }

    @Test
    void testCreateAccount_WhenCustomerExists_Success() {
        AccountCreateRequest request = new AccountCreateRequest(100L, AccountType.SAVINGS, new BigDecimal("500.00"));

        when(customerClient.existsById(100L)).thenReturn(true);
        when(accountRepository.existsByAccountNumber(any())).thenReturn(false);
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> {
            Account account = invocation.getArgument(0);
            account.setAccountId(1L);
            return account;
        });

        AccountResponse response = accountService.createAccount(request);

        assertNotNull(response);
        assertEquals(100L, response.getCustomerId());
        assertEquals(AccountType.SAVINGS, response.getAccountType());
        assertNotNull(response.getAccountNumber());
        assertEquals(10, response.getAccountNumber().length());
        assertEquals(new BigDecimal("500.00"), response.getBalance());
        assertEquals(AccountStatus.ACTIVE, response.getStatus());

        verify(customerClient, times(1)).existsById(100L);
        verify(accountRepository, times(1)).save(any(Account.class));
    }

    @Test
    void testCreateAccount_WhenCustomerDoesNotExist_ThrowsCustomerNotFoundException() {
        AccountCreateRequest request = new AccountCreateRequest(999L, AccountType.SAVINGS, new BigDecimal("500.00"));

        when(customerClient.existsById(999L)).thenReturn(false);

        CustomerNotFoundException ex = assertThrows(CustomerNotFoundException.class,
                () -> accountService.createAccount(request));

        assertTrue(ex.getMessage().contains("Customer not found"));
        verify(accountRepository, never()).save(any());
    }

    @Test
    void testCreateAccount_WhenCustomerCreatesForAnotherCustomer_ThrowsOwnershipViolation() {
        UserContext customerContext = UserContext.builder()
                .userId(10L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(100L)
                .build();
        UserContextHolder.setContext(customerContext);

        AccountCreateRequest request = new AccountCreateRequest(200L, AccountType.SAVINGS, new BigDecimal("100.00"));

        assertThrows(AccountOwnershipViolationException.class,
                () -> accountService.createAccount(request));

        verify(accountRepository, never()).save(any());
    }

    @Test
    void testGetAccountById_OwnAccount_Success() {
        UserContext customerContext = UserContext.builder()
                .userId(10L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(100L)
                .build();
        UserContextHolder.setContext(customerContext);

        when(accountRepository.findById(1L)).thenReturn(Optional.of(mockAccount));

        AccountResponse response = accountService.getAccountById(1L);

        assertNotNull(response);
        assertEquals("1234567890", response.getAccountNumber());
        assertEquals(new BigDecimal("1500.00"), response.getBalance());
    }

    @Test
    void testGetAccountById_OtherCustomerAccount_ThrowsOwnershipViolation() {
        UserContext customerContext = UserContext.builder()
                .userId(10L)
                .username("customer2")
                .role("CUSTOMER")
                .customerId(200L)
                .build();
        UserContextHolder.setContext(customerContext);

        when(accountRepository.findById(1L)).thenReturn(Optional.of(mockAccount));

        assertThrows(AccountOwnershipViolationException.class,
                () -> accountService.getAccountById(1L));
    }

    @Test
    void testGetAccountById_EmployeeRole_CanAccessAnyAccount() {
        UserContext employeeContext = UserContext.builder()
                .userId(2L)
                .username("employee")
                .role("EMPLOYEE")
                .employeeId(1L)
                .build();
        UserContextHolder.setContext(employeeContext);

        when(accountRepository.findById(1L)).thenReturn(Optional.of(mockAccount));

        AccountResponse response = accountService.getAccountById(1L);
        assertNotNull(response);
        assertEquals(100L, response.getCustomerId());
    }

    @Test
    void testGetAccountById_NotFound() {
        when(accountRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> accountService.getAccountById(99L));
    }

    @Test
    void testUpdateAccount_MetadataOnly_BalanceUnchanged() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(mockAccount));
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AccountUpdateRequest updateRequest = new AccountUpdateRequest(AccountType.CURRENT);
        AccountResponse response = accountService.updateAccount(1L, updateRequest);

        assertNotNull(response);
        assertEquals(AccountType.CURRENT, response.getAccountType());
        assertEquals(new BigDecimal("1500.00"), response.getBalance());
        assertEquals("1234567890", response.getAccountNumber());
    }

    @Test
    void testUpdateAccountStatus_Employee_Success() {
        UserContext employeeContext = UserContext.builder()
                .userId(2L)
                .username("employee")
                .role("EMPLOYEE")
                .build();
        UserContextHolder.setContext(employeeContext);

        when(accountRepository.findById(1L)).thenReturn(Optional.of(mockAccount));
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AccountStatusUpdateRequest statusRequest = new AccountStatusUpdateRequest(AccountStatus.INACTIVE);
        AccountResponse response = accountService.updateAccountStatus(1L, statusRequest);

        assertNotNull(response);
        assertEquals(AccountStatus.INACTIVE, response.getStatus());
    }

    @Test
    void testUpdateAccountStatus_Customer_Denied() {
        UserContext customerContext = UserContext.builder()
                .userId(10L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(100L)
                .build();
        UserContextHolder.setContext(customerContext);

        when(accountRepository.findById(1L)).thenReturn(Optional.of(mockAccount));

        AccountStatusUpdateRequest statusRequest = new AccountStatusUpdateRequest(AccountStatus.INACTIVE);
        assertThrows(AccessDeniedException.class,
                () -> accountService.updateAccountStatus(1L, statusRequest));
    }

    @Test
    void testDeleteAccount_SoftClosure_StatusSetToClosed() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(mockAccount));
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));

        accountService.deleteAccount(1L);

        assertEquals(AccountStatus.CLOSED, mockAccount.getStatus());
        verify(accountRepository, times(1)).save(mockAccount);
        verify(accountRepository, never()).delete(any(Account.class));
    }

    @Test
    void testGetAllAccounts_Customer_QueriesOwnAccounts_Success() {
        UserContext customerContext = UserContext.builder()
                .userId(10L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(100L)
                .build();
        UserContextHolder.setContext(customerContext);

        when(accountRepository.findAll(any(Specification.class))).thenReturn(List.of(mockAccount));

        List<AccountResponse> accounts = accountService.getAllAccounts(100L);

        assertNotNull(accounts);
        assertEquals(1, accounts.size());
        assertEquals(100L, accounts.get(0).getCustomerId());
    }

    @Test
    void testGetAllAccounts_Customer_AttemptsToQueryOtherCustomer_ThrowsOwnershipViolation() {
        UserContext customerContext = UserContext.builder()
                .userId(10L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(100L)
                .build();
        UserContextHolder.setContext(customerContext);

        assertThrows(AccountOwnershipViolationException.class,
                () -> accountService.getAllAccounts(200L));
    }

    @Test
    void testGetAllAccounts_Customer_MissingCustomerIdInContext_ThrowsOwnershipViolation() {
        UserContext customerContext = UserContext.builder()
                .userId(10L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(null)
                .build();
        UserContextHolder.setContext(customerContext);

        assertThrows(AccountOwnershipViolationException.class,
                () -> accountService.getAllAccounts(null));
    }

    @Test
    void testGetAllAccounts_Employee_CanQueryAnyCustomer() {
        UserContext employeeContext = UserContext.builder()
                .userId(2L)
                .username("employee")
                .role("EMPLOYEE")
                .employeeId(1L)
                .build();
        UserContextHolder.setContext(employeeContext);

        when(accountRepository.findAll(any(Specification.class))).thenReturn(List.of(mockAccount));

        List<AccountResponse> accounts = accountService.getAllAccounts(200L);

        assertNotNull(accounts);
        assertEquals(1, accounts.size());
    }
}
