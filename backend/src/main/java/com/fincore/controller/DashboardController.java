package com.fincore.controller;

import com.fincore.dto.ApiResponse;
import com.fincore.entity.Account;
import com.fincore.entity.Loan;
import com.fincore.repository.AccountRepository;
import com.fincore.repository.CustomerRepository;
import com.fincore.repository.LoanRepository;
import com.fincore.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalCustomers = customerRepository.count();
        List<Account> accounts = accountRepository.findAll();
        List<Loan> loans = loanRepository.findAll();
        long totalTransactions = transactionRepository.count();

        BigDecimal totalDepositBalance = accounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalLoanBook = loans.stream()
                .map(Loan::getPrincipalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        stats.put("totalCustomers", totalCustomers);
        stats.put("totalAccounts", accounts.size());
        stats.put("totalDepositBalance", totalDepositBalance);
        stats.put("totalLoanBook", totalLoanBook);
        stats.put("totalTransactions", totalTransactions);
        stats.put("systemHealth", "OPERATIONAL_99_99");

        return ResponseEntity.ok(ApiResponse.ok("Dashboard statistics computed", stats));
    }
}
