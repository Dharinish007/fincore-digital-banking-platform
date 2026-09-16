package com.example.milestone3.operations;

import com.example.milestone3.operations.entity.Account;
import com.example.milestone3.operations.entity.AccountStatement;
import com.example.milestone3.operations.entity.LoanCollection;
import com.example.milestone3.operations.entity.LoanDisbursement;
import com.example.milestone3.settlementEngine.entity.Loan;
import com.example.milestone3.settlementEngine.entity.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/operations")
@RequiredArgsConstructor
public class OperationsController {
    private final OperationsService service;

    @GetMapping("/accounts")
    public List<OperationsDtos.AccountResponse> accounts() { return service.accounts(); }

    @PostMapping("/accounts")
    @ResponseStatus(HttpStatus.CREATED)
    public Account addAccount(@RequestBody OperationsDtos.CreateAccountRequest request) { return service.addAccount(request); }

    @GetMapping("/customers")
    public List<com.example.milestone3.operations.entity.Customer> customers() { return service.customers(); }

    @GetMapping("/customers/{customerId}")
    public ResponseEntity<com.example.milestone3.operations.entity.Customer> getCustomer(@PathVariable Long customerId) {
        return service.getCustomer(customerId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/customers")
    @ResponseStatus(HttpStatus.CREATED)
    public com.example.milestone3.operations.entity.Customer addCustomer(@RequestBody OperationsDtos.CustomerRequest request) { return service.addCustomer(request); }

    @GetMapping("/accounts/{accountId}/statement")
    public List<AccountStatement> statement(@PathVariable Long accountId) { return service.statement(accountId); }

    @PostMapping("/accounts/{accountId}/lifecycle")
    public Account lifecycle(@PathVariable Long accountId, @RequestBody OperationsDtos.LifecycleRequest request) { return service.updateLifecycle(accountId, request.status()); }

    @PostMapping("/accounts/{accountId}/balance-adjustments")
    public Account adjustBalance(@PathVariable Long accountId, @RequestBody OperationsDtos.BalanceAdjustmentRequest request) { return service.adjustBalance(accountId, request); }

    @GetMapping("/loans")
    public List<OperationsDtos.LoanDetailResponse> loans() { return service.loans(); }

    @PostMapping("/loans/apply")
    @ResponseStatus(HttpStatus.CREATED)
    public Loan applyLoan(@RequestBody OperationsDtos.ApplyLoanRequest request) {
        return service.applyLoan(request);
    }

    @PostMapping("/loans/{loanId}/approve")
    public Loan approveLoan(@PathVariable Long loanId) {
        return service.approveLoan(loanId);
    }

    @PostMapping("/loans/{loanId}/reject")
    public Loan rejectLoan(@PathVariable Long loanId, @RequestBody(required = false) OperationsDtos.LoanActionRequest request) {
        return service.rejectLoan(loanId, request != null ? request.remarks() : "Application rejected by loan review officer.");
    }

    @PostMapping("/loans/{loanId}/overdue")
    public Loan markOverdue(@PathVariable Long loanId, @RequestBody(required = false) OperationsDtos.LoanActionRequest request) {
        return service.markOverdue(loanId, request != null ? request.remarks() : "EMI due date elapsed without payment");
    }

    @GetMapping("/transactions")
    public List<Transaction> transactions() { return service.transactions(); }

    @PostMapping("/transactions")
    @ResponseStatus(HttpStatus.CREATED)
    public Transaction addTransaction(@RequestBody OperationsDtos.CreateTransactionRequest request) {
        return service.addTransaction(request);
    }

    @PostMapping("/emi")
    public OperationsDtos.EmiResult emi(@RequestBody OperationsDtos.EmiRequest request) { return service.calculateEmi(request); }

    @GetMapping("/disbursements")
    public List<LoanDisbursement> disbursements() { return service.disbursements(); }

    @PostMapping("/disbursements")
    @ResponseStatus(HttpStatus.CREATED)
    public LoanDisbursement disburse(@RequestBody OperationsDtos.DisbursementRequest request) { return service.disburse(request); }

    @GetMapping("/collections")
    public List<LoanCollection> collections() { return service.collections(); }

    @PostMapping("/collections")
    @ResponseStatus(HttpStatus.CREATED)
    public LoanCollection collect(@RequestBody OperationsDtos.CollectionRequest request) { return service.collect(request); }
}
