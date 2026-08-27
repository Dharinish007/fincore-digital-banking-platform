package com.example.milestone3.operations;

import com.example.milestone3.operations.entity.Account;
import com.example.milestone3.operations.entity.AccountStatement;
import com.example.milestone3.operations.entity.LoanCollection;
import com.example.milestone3.operations.entity.LoanDisbursement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/operations")
@RequiredArgsConstructor
public class OperationsController {
    private final OperationsService service;

    @GetMapping("/accounts")
    public List<Account> accounts() { return service.accounts(); }

    @GetMapping("/customers")
    public List<com.example.milestone3.operations.entity.Customer> customers() { return service.customers(); }

    @PostMapping("/customers")
    @ResponseStatus(HttpStatus.CREATED)
    public com.example.milestone3.operations.entity.Customer addCustomer(@RequestBody OperationsDtos.CustomerRequest request) { return service.addCustomer(request); }

    @GetMapping("/accounts/{accountId}/statement")
    public List<AccountStatement> statement(@PathVariable Long accountId) { return service.statement(accountId); }

    @PostMapping("/accounts/{accountId}/lifecycle")
    public Account lifecycle(@PathVariable Long accountId, @RequestBody OperationsDtos.LifecycleRequest request) { return service.updateLifecycle(accountId, request.status()); }

    @PostMapping("/accounts/{accountId}/balance-adjustments")
    public Account adjustBalance(@PathVariable Long accountId, @RequestBody OperationsDtos.BalanceAdjustmentRequest request) { return service.adjustBalance(accountId, request); }

    @PostMapping("/emi")
    public OperationsDtos.EmiResult emi(@RequestBody OperationsDtos.EmiRequest request) { return service.calculateEmi(request); }

    @PostMapping("/disbursements")
    @ResponseStatus(HttpStatus.CREATED)
    public LoanDisbursement disburse(@RequestBody OperationsDtos.DisbursementRequest request) { return service.disburse(request); }

    @PostMapping("/collections")
    @ResponseStatus(HttpStatus.CREATED)
    public LoanCollection collect(@RequestBody OperationsDtos.CollectionRequest request) { return service.collect(request); }
}
