package com.fincore.BankingManagement.balanceaccuracy.controller;

import com.fincore.BankingManagement.BankingServices.repository.TransactionRepository.AccountRepositery.AccountRepository;
import com.fincore.BankingManagement.BankingServices.model.Customer;
import com.fincore.BankingManagement.BankingServices.Enums.AccountStatus;
import com.fincore.BankingManagement.Entities.Account;
import com.fincore.BankingManagement.balanceaccuracy.service.BalanceAccuracyService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import com.fincore.BankingManagement.balanceaccuracy.dto.BalanceAccuracyAccountDTO;

@RestController
@RequestMapping("/api/balance-accuracy")
public class BalanceAccuracyController {

        private final BalanceAccuracyService balanceAccuracyService;
        private final AccountRepository accountRepository;

        public BalanceAccuracyController(
                        BalanceAccuracyService balanceAccuracyService,
                        AccountRepository accountRepository) {

                this.balanceAccuracyService = balanceAccuracyService;
                this.accountRepository = accountRepository;
        }

        @GetMapping("/{accountNo}")
        public ResponseEntity<Map<String, Object>> checkBalanceAccuracy(
                        @PathVariable String accountNo) {

                Account account = accountRepository.findByAccountNo(accountNo)
                                .orElseThrow(() -> new RuntimeException("Account not found: " + accountNo));

                BigDecimal expectedBalance = balanceAccuracyService.calculateExpectedBalance(account);

                BigDecimal actualBalance = account.getBalance();

                boolean accurate = balanceAccuracyService.isBalanceAccurate(account);

                Map<String, Object> response = new HashMap<>();

                response.put("accountNo", accountNo);
                response.put("actualBalance", actualBalance);
                response.put("expectedBalance", expectedBalance);
                response.put("balanceAccurate", accurate);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/accounts")
        public ResponseEntity<List<BalanceAccuracyAccountDTO>> listAllAccounts() {
                List<Account> accounts = accountRepository.findAll();

                List<BalanceAccuracyAccountDTO> responseList = new ArrayList<>();

                for (Account account : accounts) {
                        Customer customer = account.getCustomer();
                        BigDecimal expectedBalance = balanceAccuracyService
                                        .calculateExpectedBalance(account);
                        BigDecimal actualBalance = account.getBalance();
                        boolean accurate = balanceAccuracyService.isBalanceAccurate(account);

                        BalanceAccuracyAccountDTO dto = new BalanceAccuracyAccountDTO();
                        dto.setId(account.getAccountNo());
                        dto.setAccountNumber(account.getAccountNo());
                        dto.setCustomerName(customer != null ? customer.getFullName() : "");
                        dto.setCustomerId(customer != null ? String.valueOf(customer.getCustomerId()) : "");
                        dto.setEmail(customer != null ? customer.getEmail() : "");
                        dto.setPhone(customer != null ? customer.getMobileNumber() : "");
                        dto.setBranch(account.getBranchName());
                        dto.setAccountType(account.getAccountType() != null ? account.getAccountType().toString() : "");
                        dto.setLedgerBalance(actualBalance);
                        dto.setAvailableBalance(actualBalance);
                        dto.setSystemCalculatedBalance(expectedBalance);
                        dto.setDifference(actualBalance.subtract(expectedBalance));
                        dto.setBalanceAccurate(accurate);
                        dto.setStatus(accurate ? "Verified" : "Mismatch");
                        dto.setAccountStatus(account.getStatus() != null ? account.getStatus().toString() : "");
                        dto.setActive(account.getStatus() == AccountStatus.Active);
                        dto.setLastVerified(LocalDateTime.now().toString());
                        dto.setRemarks(accurate
                                        ? "Backend reconciliation confirmed the ledger balance."
                                        : "Backend calculation found a discrepancy in ledger balance.");
                        dto.setPendingTransactions(List.of());
                        dto.setDebitHolds(List.of());
                        dto.setCreditHolds(List.of());
                        dto.setFrozen(false);
                        dto.setKycStatus("Verified");
                        dto.setCurrency("₹");

                        responseList.add(dto);
                }

                return ResponseEntity.ok(responseList);
        }
}