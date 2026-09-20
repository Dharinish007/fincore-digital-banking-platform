package com.fincore.transaction.service;

import com.fincore.transaction.client.AccountClient;
import com.fincore.transaction.dto.*;
import com.fincore.transaction.entity.*;
import com.fincore.transaction.exception.AccountNotFoundException;
import com.fincore.transaction.exception.AccountServiceException;
import com.fincore.transaction.exception.InsufficientBalanceException;
import com.fincore.transaction.exception.TransactionOwnershipViolationException;
import com.fincore.transaction.repository.TransactionRepository;
import com.fincore.transaction.security.UserContext;
import com.fincore.transaction.security.UserContextHolder;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final AccountClient accountClient;
    private final TransactionRepository transactionRepository;
    private final TransactionAuditService transactionAuditService;

    @Transactional
    public TransactionResponse deposit(DepositRequest request) {
        validateAmount(request.getAmount());

        AccountResponse account;
        try {
            account = accountClient.credit(
                    request.getAccountNumber(),
                    request.getAmount()
            );
        } catch (AccountServiceException e) {
            if (e.getStatusCode() == 404) {
                throw new AccountNotFoundException(request.getAccountNumber());
            }
            throw e;
        }

        Transaction tx = Transaction.builder()
                .referenceId(newReferenceId())
                .accountNumber(account.getAccountNumber())
                .type(TransactionType.DEPOSIT)
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .status(TransactionStatus.SUCCESS)
                .remarks(request.getRemarks())
                .build();

        return TransactionResponse.from(transactionRepository.save(tx));
    }

    @Transactional
    public TransactionResponse withdraw(WithdrawRequest request) {
        validateAmount(request.getAmount());

        // Enforce customer ownership on withdrawal
        UserContext authUser = UserContextHolder.getContext();
        if (authUser != null && authUser.isCustomer() && authUser.getCustomerId() != null) {
            verifyAccountOwnership(request.getAccountNumber(), authUser.getCustomerId());
        }

        AccountResponse account;
        try {
            account = accountClient.debit(
                    request.getAccountNumber(),
                    request.getAmount()
            );
        } catch (AccountServiceException e) {
            String refId = newReferenceId();

            transactionAuditService.recordFailedTransaction(
                    refId,
                    request.getAccountNumber(),
                    null,
                    TransactionType.WITHDRAWAL,
                    request.getAmount(),
                    BigDecimal.ZERO,
                    "Withdrawal failed"
            );

            if (e.getStatusCode() == 400) {
                throw new InsufficientBalanceException(request.getAccountNumber());
            }

            throw e;
        }

        Transaction tx = Transaction.builder()
                .referenceId(newReferenceId())
                .accountNumber(account.getAccountNumber())
                .type(TransactionType.WITHDRAWAL)
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .status(TransactionStatus.SUCCESS)
                .remarks(request.getRemarks())
                .build();

        return TransactionResponse.from(transactionRepository.save(tx));
    }

    @Transactional
    public TransactionResponse transfer(TransferRequest request) {
        validateAmount(request.getAmount());

        if (request.getFromAccountNumber().trim()
                .equalsIgnoreCase(request.getToAccountNumber().trim())) {
            throw new IllegalArgumentException(
                    "fromAccountNumber and toAccountNumber must differ");
        }

        // Enforce customer ownership on source account
        UserContext authUser = UserContextHolder.getContext();
        if (authUser != null && authUser.isCustomer() && authUser.getCustomerId() != null) {
            verifyAccountOwnership(request.getFromAccountNumber(), authUser.getCustomerId());
        }

        AccountResponse fromAccount = accountClient.debit(
                request.getFromAccountNumber(),
                request.getAmount()
        );

        AccountResponse toAccount;
        try {
            toAccount = accountClient.credit(
                    request.getToAccountNumber(),
                    request.getAmount()
            );
        } catch (AccountServiceException e) {
            // Compensating action: restore the debited amount.
            accountClient.credit(
                    request.getFromAccountNumber(),
                    request.getAmount()
            );
            if (e.getStatusCode() == 404) {
                throw new AccountNotFoundException(request.getToAccountNumber());
            }

            throw e;
        }

        String sharedRef = newReferenceId();

        transactionRepository.save(Transaction.builder()
                .referenceId(sharedRef + "-OUT")
                .accountNumber(fromAccount.getAccountNumber())
                .counterpartyAccountNumber(toAccount.getAccountNumber())
                .type(TransactionType.TRANSFER_OUT)
                .amount(request.getAmount())
                .balanceAfter(fromAccount.getBalance())
                .status(TransactionStatus.SUCCESS)
                .remarks(request.getRemarks())
                .build());

        Transaction inTx = transactionRepository.save(Transaction.builder()
                .referenceId(sharedRef + "-IN")
                .accountNumber(toAccount.getAccountNumber())
                .counterpartyAccountNumber(fromAccount.getAccountNumber())
                .type(TransactionType.TRANSFER_IN)
                .amount(request.getAmount())
                .balanceAfter(toAccount.getBalance())
                .status(TransactionStatus.SUCCESS)
                .remarks(request.getRemarks())
                .build());

        return TransactionResponse.from(inTx);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getHistory(
            String accountNumber,
            Pageable pageable) {

        // Enforce ownership if caller is CUSTOMER
        UserContext authUser = UserContextHolder.getContext();
        if (authUser != null && authUser.isCustomer() && authUser.getCustomerId() != null) {
            verifyAccountOwnership(accountNumber, authUser.getCustomerId());
        }

        return transactionRepository
                .findByAccountNumberOrderByCreatedAtDesc(accountNumber, pageable)
                .map(TransactionResponse::from);
    }

    @Transactional(readOnly = true)
    public TransactionStatisticsResponse getStatistics() {
        long totalTransactions = transactionRepository.count();
        long successfulTransactions = transactionRepository.countByStatus(TransactionStatus.SUCCESS);
        long failedTransactions = transactionRepository.countByStatus(TransactionStatus.FAILED);
        long deposits = transactionRepository.countByType(TransactionType.DEPOSIT);
        long withdrawals = transactionRepository.countByType(TransactionType.WITHDRAWAL);
        long transferIn = transactionRepository.countByType(TransactionType.TRANSFER_IN);
        long transferOut = transactionRepository.countByType(TransactionType.TRANSFER_OUT);
        BigDecimal totalDepositAmount = transactionRepository.sumAmountByType(TransactionType.DEPOSIT);
        BigDecimal totalWithdrawalAmount = transactionRepository.sumAmountByType(TransactionType.WITHDRAWAL);
        BigDecimal transferInAmount = transactionRepository.sumAmountByType(TransactionType.TRANSFER_IN);
        BigDecimal transferOutAmount = transactionRepository.sumAmountByType(TransactionType.TRANSFER_OUT);
        BigDecimal totalTransferAmount = transferInAmount.add(transferOutAmount);

        return new TransactionStatisticsResponse(
                totalTransactions,
                successfulTransactions,
                failedTransactions,
                deposits,
                withdrawals,
                transferIn + transferOut,
                totalDepositAmount,
                totalWithdrawalAmount,
                totalTransferAmount
        );
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getRecentTransactions(int limit) {
        if (limit < 1 || limit > 100) {
            throw new IllegalArgumentException("Limit must be between 1 and 100");
        }

        UserContext authUser = UserContextHolder.getContext();
        if (authUser != null && authUser.isCustomer() && authUser.getCustomerId() != null) {
            return getTransactionsByCustomerId(authUser.getCustomerId(), PageRequest.of(0, limit));
        }

        Pageable pageable = PageRequest.of(0, limit);
        return transactionRepository
                .findAllByOrderByCreatedAtDesc(pageable)
                .map(TransactionResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getAllTransactions(
            String search,
            String typeStr,
            String statusStr,
            BigDecimal minAmount,
            BigDecimal maxAmount,
            String startDateStr,
            String endDateStr,
            Pageable pageable) {

        UserContext authUser = UserContextHolder.getContext();
        List<String> customerAllowedAccounts = null;
        if (authUser != null && authUser.isCustomer() && authUser.getCustomerId() != null) {
            List<AccountResponse> accounts = accountClient.getAccountsByCustomerId(authUser.getCustomerId());
            customerAllowedAccounts = accounts.stream()
                    .map(AccountResponse::getAccountNumber)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            if (customerAllowedAccounts.isEmpty()) {
                return Page.empty(pageable);
            }
        }

        TransactionType type = null;
        if (typeStr != null && !typeStr.trim().isEmpty()) {
            try {
                type = TransactionType.valueOf(typeStr.trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        TransactionStatus status = null;
        if (statusStr != null && !statusStr.trim().isEmpty()) {
            try {
                String cleanStatus = statusStr.trim().toUpperCase();
                if ("COMPLETED".equals(cleanStatus)) {
                    cleanStatus = "SUCCESS";
                }
                status = TransactionStatus.valueOf(cleanStatus);
            } catch (IllegalArgumentException ignored) {}
        }

        java.time.LocalDateTime startDate = null;
        if (startDateStr != null && !startDateStr.trim().isEmpty()) {
            try {
                startDate = java.time.LocalDate.parse(startDateStr.trim().substring(0, 10)).atStartOfDay();
            } catch (Exception ignored) {}
        }

        java.time.LocalDateTime endDate = null;
        if (endDateStr != null && !endDateStr.trim().isEmpty()) {
            try {
                endDate = java.time.LocalDate.parse(endDateStr.trim().substring(0, 10)).atTime(23, 59, 59);
            } catch (Exception ignored) {}
        }

        final TransactionType finalType = type;
        final TransactionStatus finalStatus = status;
        final java.time.LocalDateTime finalStartDate = startDate;
        final java.time.LocalDateTime finalEndDate = endDate;
        final String finalSearch = (search != null && !search.trim().isEmpty()) ? search.trim().toLowerCase() : null;
        final List<String> finalAllowedAccounts = customerAllowedAccounts;

        Specification<Transaction> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (finalAllowedAccounts != null) {
                predicates.add(root.get("accountNumber").in(finalAllowedAccounts));
            }

            if (finalSearch != null) {
                String searchPattern = "%" + finalSearch + "%";
                Predicate refPred = cb.like(cb.lower(root.get("referenceId")), searchPattern);
                Predicate accPred = cb.like(cb.lower(root.get("accountNumber")), searchPattern);
                Predicate remPred = cb.like(cb.lower(cb.coalesce(root.get("remarks"), "")), searchPattern);
                predicates.add(cb.or(refPred, accPred, remPred));
            }

            if (finalType != null) {
                predicates.add(cb.equal(root.get("type"), finalType));
            }

            if (finalStatus != null) {
                predicates.add(cb.equal(root.get("status"), finalStatus));
            }

            if (minAmount != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("amount"), minAmount));
            }

            if (maxAmount != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("amount"), maxAmount));
            }

            if (finalStartDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), finalStartDate));
            }

            if (finalEndDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), finalEndDate));
            }

            if (query != null) {
                query.orderBy(cb.desc(root.get("createdAt")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return transactionRepository.findAll(spec, pageable).map(TransactionResponse::from);
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(String idOrRef) {
        if (idOrRef == null || idOrRef.trim().isEmpty()) {
            throw new IllegalArgumentException("Transaction ID or Reference is required");
        }
        String clean = idOrRef.trim();
        Transaction tx;
        if (clean.matches("^\\d+$")) {
            tx = transactionRepository.findById(Long.parseLong(clean))
                    .orElseGet(() -> transactionRepository.findByReferenceId(clean)
                            .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + clean)));
        } else {
            tx = transactionRepository.findByReferenceId(clean)
                    .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + clean));
        }

        // Verify customer ownership if caller is CUSTOMER
        UserContext authUser = UserContextHolder.getContext();
        if (authUser != null && authUser.isCustomer() && authUser.getCustomerId() != null) {
            List<AccountResponse> customerAccounts = accountClient.getAccountsByCustomerId(authUser.getCustomerId());
            Set<String> accountNumbers = customerAccounts.stream()
                    .map(AccountResponse::getAccountNumber)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            boolean ownsAccount = accountNumbers.contains(tx.getAccountNumber())
                    || (tx.getCounterpartyAccountNumber() != null && accountNumbers.contains(tx.getCounterpartyAccountNumber()));

            if (!ownsAccount) {
                log.warn("Customer {} attempted unauthorized access to transaction {}", authUser.getCustomerId(), idOrRef);
                throw new TransactionOwnershipViolationException("Access denied: You do not have permission to view transaction " + idOrRef);
            }
        }

        return TransactionResponse.from(tx);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getTransactionsByCustomerId(Long customerId, Pageable pageable) {
        UserContext authUser = UserContextHolder.getContext();
        Long effectiveCustomerId = customerId;
        if (authUser != null && authUser.isCustomer() && authUser.getCustomerId() != null) {
            effectiveCustomerId = authUser.getCustomerId();
        }

        List<AccountResponse> customerAccounts = accountClient.getAccountsByCustomerId(effectiveCustomerId);
        if (customerAccounts == null || customerAccounts.isEmpty()) {
            return Page.empty(pageable);
        }
        List<String> accountNumbers = customerAccounts.stream()
                .map(AccountResponse::getAccountNumber)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        if (accountNumbers.isEmpty()) {
            return Page.empty(pageable);
        }
        return transactionRepository.findByAccountNumberInOrderByCreatedAtDesc(accountNumbers, pageable)
                .map(TransactionResponse::from);
    }

    @Transactional
    public TransactionResponse createTransaction(CreateTransactionRequest request) {
        if (request == null || request.getType() == null) {
            throw new IllegalArgumentException("Transaction type is required");
        }
        String rawType = request.getType().trim().toUpperCase();

        String sourceAcc = accountClient.resolveAccountNumber(request.getSourceAccountId());
        String destAcc = accountClient.resolveAccountNumber(request.getDestinationAccountId());

        if ("DEPOSIT".equals(rawType)) {
            DepositRequest dep = new DepositRequest();
            dep.setAccountNumber(sourceAcc != null ? sourceAcc : destAcc);
            dep.setAmount(request.getAmount());
            dep.setRemarks(request.getDescription());
            return deposit(dep);
        } else if ("WITHDRAWAL".equals(rawType) || "WITHDRAW".equals(rawType) || "PAYMENT".equals(rawType) || "FEE".equals(rawType)) {
            WithdrawRequest with = new WithdrawRequest();
            with.setAccountNumber(sourceAcc);
            with.setAmount(request.getAmount());
            with.setRemarks(request.getDescription());
            return withdraw(with);
        } else if ("TRANSFER".equals(rawType) || "TRANSFER_IN".equals(rawType) || "TRANSFER_OUT".equals(rawType)) {
            TransferRequest trf = new TransferRequest();
            trf.setFromAccountNumber(sourceAcc);
            trf.setToAccountNumber(destAcc);
            trf.setAmount(request.getAmount());
            trf.setRemarks(request.getDescription());
            return transfer(trf);
        } else {
            throw new IllegalArgumentException("Unsupported transaction type: " + request.getType());
        }
    }

    private void verifyAccountOwnership(String accountNumber, Long customerId) {
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Account number is required");
        }
        try {
            AccountResponse account = accountClient.getAccountByNumber(accountNumber.trim());
            if (account == null || account.getCustomerId() == null || !account.getCustomerId().equals(customerId)) {
                log.warn("Account ownership check failed: customerId={}, accountNumber={}, accountOwner={}",
                        customerId, accountNumber, account != null ? account.getCustomerId() : "null");
                throw new TransactionOwnershipViolationException("Access denied: You do not own account " + accountNumber);
            }
        } catch (AccountServiceException e) {
            if (e.getStatusCode() == 404) {
                throw new AccountNotFoundException(accountNumber);
            }
            throw e;
        }
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transaction amount must be strictly positive");
        }
    }

    private String newReferenceId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }
}
