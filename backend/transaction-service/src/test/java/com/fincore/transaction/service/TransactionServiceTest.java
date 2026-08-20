package com.fincore.transaction.service;

import com.fincore.transaction.client.AccountClient;
import com.fincore.transaction.dto.*;
import com.fincore.transaction.entity.Transaction;
import com.fincore.transaction.entity.TransactionStatus;
import com.fincore.transaction.entity.TransactionType;
import com.fincore.transaction.exception.TransactionOwnershipViolationException;
import com.fincore.transaction.repository.TransactionRepository;
import com.fincore.transaction.security.UserContext;
import com.fincore.transaction.security.UserContextHolder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private AccountClient accountClient;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private TransactionAuditService transactionAuditService;

    @InjectMocks
    private TransactionService transactionService;

    private AccountResponse ownAccount;
    private AccountResponse otherAccount;

    @BeforeEach
    void setUp() {
        ownAccount = new AccountResponse();
        ownAccount.setAccountId(1L);
        ownAccount.setCustomerId(100L);
        ownAccount.setAccountNumber("ACC-100");
        ownAccount.setBalance(new BigDecimal("1000.00"));
        ownAccount.setStatus("ACTIVE");

        otherAccount = new AccountResponse();
        otherAccount.setAccountId(2L);
        otherAccount.setCustomerId(200L);
        otherAccount.setAccountNumber("ACC-200");
        otherAccount.setBalance(new BigDecimal("500.00"));
        otherAccount.setStatus("ACTIVE");
    }

    @AfterEach
    void tearDown() {
        UserContextHolder.clear();
    }

    @Test
    void testDeposit_Success() {
        DepositRequest req = new DepositRequest();
        req.setAccountNumber("ACC-100");
        req.setAmount(new BigDecimal("200.00"));
        req.setRemarks("Deposit Test");

        AccountResponse creditedAccount = new AccountResponse();
        creditedAccount.setAccountNumber("ACC-100");
        creditedAccount.setBalance(new BigDecimal("1200.00"));

        when(accountClient.credit("ACC-100", new BigDecimal("200.00"))).thenReturn(creditedAccount);
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> {
            Transaction t = inv.getArgument(0);
            t.setId(10L);
            return t;
        });

        TransactionResponse res = transactionService.deposit(req);
        assertNotNull(res);
        assertEquals("ACC-100", res.getAccountNumber());
        assertEquals(new BigDecimal("200.00"), res.getAmount());
        assertEquals(TransactionType.DEPOSIT, res.getType());
        assertEquals(TransactionStatus.SUCCESS, res.getStatus());
    }

    @Test
    void testWithdraw_CustomerOwnAccount_Success() {
        UserContext customer = UserContext.builder()
                .userId(1L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(100L)
                .build();
        UserContextHolder.setContext(customer);

        WithdrawRequest req = new WithdrawRequest();
        req.setAccountNumber("ACC-100");
        req.setAmount(new BigDecimal("100.00"));

        when(accountClient.getAccountByNumber("ACC-100")).thenReturn(ownAccount);
        when(accountClient.debit("ACC-100", new BigDecimal("100.00"))).thenReturn(ownAccount);
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> {
            Transaction t = inv.getArgument(0);
            t.setId(11L);
            return t;
        });

        TransactionResponse res = transactionService.withdraw(req);
        assertNotNull(res);
        assertEquals(TransactionType.WITHDRAWAL, res.getType());
        assertEquals(TransactionStatus.SUCCESS, res.getStatus());
    }

    @Test
    void testWithdraw_CustomerAccessingOtherAccount_ThrowsOwnershipViolation() {
        UserContext customer = UserContext.builder()
                .userId(1L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(100L)
                .build();
        UserContextHolder.setContext(customer);

        WithdrawRequest req = new WithdrawRequest();
        req.setAccountNumber("ACC-200");
        req.setAmount(new BigDecimal("100.00"));

        when(accountClient.getAccountByNumber("ACC-200")).thenReturn(otherAccount);

        assertThrows(TransactionOwnershipViolationException.class,
                () -> transactionService.withdraw(req));

        verify(accountClient, never()).debit(any(), any());
    }

    @Test
    void testTransfer_CustomerOwnAccount_Success() {
        UserContext customer = UserContext.builder()
                .userId(1L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(100L)
                .build();
        UserContextHolder.setContext(customer);

        TransferRequest req = new TransferRequest();
        req.setFromAccountNumber("ACC-100");
        req.setToAccountNumber("ACC-200");
        req.setAmount(new BigDecimal("50.00"));

        when(accountClient.getAccountByNumber("ACC-100")).thenReturn(ownAccount);
        when(accountClient.debit("ACC-100", new BigDecimal("50.00"))).thenReturn(ownAccount);
        when(accountClient.credit("ACC-200", new BigDecimal("50.00"))).thenReturn(otherAccount);
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> {
            Transaction t = inv.getArgument(0);
            t.setId(12L);
            return t;
        });

        TransactionResponse res = transactionService.transfer(req);
        assertNotNull(res);
        assertEquals(TransactionType.TRANSFER_IN, res.getType());
    }

    @Test
    void testTransfer_CustomerTransferFromOtherAccount_ThrowsOwnershipViolation() {
        UserContext customer = UserContext.builder()
                .userId(1L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(100L)
                .build();
        UserContextHolder.setContext(customer);

        TransferRequest req = new TransferRequest();
        req.setFromAccountNumber("ACC-200");
        req.setToAccountNumber("ACC-100");
        req.setAmount(new BigDecimal("50.00"));

        when(accountClient.getAccountByNumber("ACC-200")).thenReturn(otherAccount);

        assertThrows(TransactionOwnershipViolationException.class,
                () -> transactionService.transfer(req));

        verify(accountClient, never()).debit(any(), any());
    }

    @Test
    void testGetHistory_CustomerOwnAccount_Success() {
        UserContext customer = UserContext.builder()
                .userId(1L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(100L)
                .build();
        UserContextHolder.setContext(customer);

        when(accountClient.getAccountByNumber("ACC-100")).thenReturn(ownAccount);

        Transaction tx = Transaction.builder()
                .id(1L)
                .referenceId("TXN-1")
                .accountNumber("ACC-100")
                .type(TransactionType.DEPOSIT)
                .amount(new BigDecimal("100.00"))
                .balanceAfter(new BigDecimal("100.00"))
                .status(TransactionStatus.SUCCESS)
                .createdAt(LocalDateTime.now())
                .build();

        Page<Transaction> page = new PageImpl<>(List.of(tx));
        when(transactionRepository.findByAccountNumberOrderByCreatedAtDesc(eq("ACC-100"), any(Pageable.class)))
                .thenReturn(page);

        Page<TransactionResponse> res = transactionService.getHistory("ACC-100", PageRequest.of(0, 10));
        assertEquals(1, res.getTotalElements());
        assertEquals("ACC-100", res.getContent().get(0).getAccountNumber());
    }

    @Test
    void testGetHistory_CustomerOtherAccount_ThrowsOwnershipViolation() {
        UserContext customer = UserContext.builder()
                .userId(1L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(100L)
                .build();
        UserContextHolder.setContext(customer);

        when(accountClient.getAccountByNumber("ACC-200")).thenReturn(otherAccount);

        assertThrows(TransactionOwnershipViolationException.class,
                () -> transactionService.getHistory("ACC-200", PageRequest.of(0, 10)));
    }

    @Test
    void testGetTransactionById_CustomerOwnTransaction_Success() {
        UserContext customer = UserContext.builder()
                .userId(1L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(100L)
                .build();
        UserContextHolder.setContext(customer);

        Transaction tx = Transaction.builder()
                .id(1L)
                .referenceId("TXN-1")
                .accountNumber("ACC-100")
                .type(TransactionType.DEPOSIT)
                .amount(new BigDecimal("100.00"))
                .balanceAfter(new BigDecimal("100.00"))
                .status(TransactionStatus.SUCCESS)
                .createdAt(LocalDateTime.now())
                .build();

        when(transactionRepository.findById(1L)).thenReturn(Optional.of(tx));
        when(accountClient.getAccountsByCustomerId(100L)).thenReturn(List.of(ownAccount));

        TransactionResponse res = transactionService.getTransactionById("1");
        assertNotNull(res);
        assertEquals("TXN-1", res.getReferenceId());
    }

    @Test
    void testGetTransactionById_CustomerOtherTransaction_ThrowsOwnershipViolation() {
        UserContext customer = UserContext.builder()
                .userId(1L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(100L)
                .build();
        UserContextHolder.setContext(customer);

        Transaction tx = Transaction.builder()
                .id(2L)
                .referenceId("TXN-2")
                .accountNumber("ACC-200")
                .type(TransactionType.DEPOSIT)
                .amount(new BigDecimal("200.00"))
                .balanceAfter(new BigDecimal("200.00"))
                .status(TransactionStatus.SUCCESS)
                .createdAt(LocalDateTime.now())
                .build();

        when(transactionRepository.findById(2L)).thenReturn(Optional.of(tx));
        when(accountClient.getAccountsByCustomerId(100L)).thenReturn(List.of(ownAccount));

        assertThrows(TransactionOwnershipViolationException.class,
                () -> transactionService.getTransactionById("2"));
    }
}
