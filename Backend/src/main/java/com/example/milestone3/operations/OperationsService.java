package com.example.milestone3.operations;

import com.example.milestone3.audit.AuditLogService;
import com.example.milestone3.fraudDetection.FraudDetectionService;
import com.example.milestone3.fraudDetection.FraudEvent;
import com.example.milestone3.fraudDetection.FraudEventRepo;
import com.example.milestone3.notificationService.service.NotificationService;
import com.example.milestone3.operations.entity.Account;
import com.example.milestone3.operations.entity.AccountStatement;
import com.example.milestone3.operations.entity.Customer;
import com.example.milestone3.operations.entity.LoanCollection;
import com.example.milestone3.operations.entity.LoanDisbursement;
import com.example.milestone3.operations.entity.LoanSchedule;
import com.example.milestone3.operations.repo.AccountRepo;
import com.example.milestone3.operations.repo.AccountStatementRepo;
import com.example.milestone3.operations.repo.CustomerRepo;
import com.example.milestone3.operations.repo.LoanCollectionRepo;
import com.example.milestone3.operations.repo.LoanDisbursementRepo;
import com.example.milestone3.operations.repo.LoanScheduleRepo;
import com.example.milestone3.risk.RiskAssessment;
import com.example.milestone3.risk.RiskAssessmentRepo;
import com.example.milestone3.settlementEngine.entity.Loan;
import com.example.milestone3.settlementEngine.entity.Settlement;
import com.example.milestone3.settlementEngine.entity.Transaction;
import com.example.milestone3.settlementEngine.repo.LoanRepo;
import com.example.milestone3.settlementEngine.repo.SettlementRepo;
import com.example.milestone3.settlementEngine.repo.TransactionRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OperationsService {
    private final AccountRepo accountRepo;
    private final AccountStatementRepo statementRepo;
    private final LoanRepo loanRepo;
    private final LoanDisbursementRepo disbursementRepo;
    private final LoanCollectionRepo collectionRepo;
    private final LoanScheduleRepo scheduleRepo;
    private final CustomerRepo customerRepo;
    private final TransactionRepo transactionRepo;
    private final FraudEventRepo fraudEventRepo;
    private final RiskAssessmentRepo riskAssessmentRepo;
    private final SettlementRepo settlementRepo;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    public List<OperationsDtos.AccountResponse> accounts() {
        List<Account> list = accountRepo.findAllByOrderByIdAsc();
        List<Customer> custList = customerRepo.findAllByOrderByIdAsc();
        Map<Long, Customer> map = custList.stream().collect(Collectors.toMap(Customer::getId, c -> c, (a, b) -> a));
        return list.stream().map(a -> {
            Customer c = a.getCustomerId() != null ? map.get(a.getCustomerId()) : null;
            return new OperationsDtos.AccountResponse(
                a.getId(),
                a.getAccountNumber(),
                a.getCustomerId(),
                c != null ? c.getFullName() : "Customer #" + a.getCustomerId(),
                c != null ? c.getEmail() : "client" + a.getCustomerId() + "@fincore.com",
                c != null ? c.getPhoneNumber() : "+91 98765 43210",
                a.getAccountType(),
                a.getBalance(),
                a.getStatus(),
                a.getOpenedAt()
            );
        }).toList();
    }

    public List<Customer> customers() { return customerRepo.findAllByOrderByIdAsc(); }

    public Optional<Customer> getCustomer(Long customerId) {
        return customerRepo.findById(customerId);
    }

    public List<OperationsDtos.LoanDetailResponse> loans() {
        List<Loan> list = loanRepo.findAll();
        List<Customer> custList = customerRepo.findAll();
        Map<Long, Customer> map = custList.stream().collect(Collectors.toMap(Customer::getId, c -> c, (a, b) -> a));
        return list.stream().map(l -> {
            Customer c = l.getCustomerId() != null ? map.get(l.getCustomerId()) : null;
            BigDecimal sanctioned = l.getTotalOutstanding() != null && l.getTotalOutstanding().compareTo(BigDecimal.ZERO) > 0
                    ? l.getTotalOutstanding().multiply(BigDecimal.valueOf(1.2)).setScale(2, RoundingMode.HALF_UP)
                    : BigDecimal.valueOf(500000);
            BigDecimal remaining = sanctioned.subtract(l.getTotalOutstanding() != null ? l.getTotalOutstanding() : BigDecimal.ZERO).max(BigDecimal.ZERO);
            BigDecimal monthlyEmi = l.getTotalOutstanding() != null && l.getTotalOutstanding().compareTo(BigDecimal.ZERO) > 0
                    ? l.getTotalOutstanding().divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP)
                    : BigDecimal.valueOf(10000);
            return new OperationsDtos.LoanDetailResponse(
                l.getId(),
                "LN1000" + l.getId(),
                l.getCustomerId(),
                c != null ? c.getFullName() : "Borrower #" + l.getCustomerId(),
                "Home Loan",
                sanctioned,
                l.getTotalOutstanding() != null ? l.getTotalOutstanding() : BigDecimal.ZERO,
                remaining,
                l.getPrincipalOutstanding() != null ? l.getPrincipalOutstanding() : l.getTotalOutstanding(),
                l.getTotalOutstanding() != null ? l.getTotalOutstanding() : BigDecimal.ZERO,
                l.getStatus() != null ? l.getStatus() : "ACTIVE",
                BigDecimal.valueOf(8.5),
                60,
                monthlyEmi
            );
        }).toList();
    }

    public List<Transaction> transactions() {
        return transactionRepo.findAllByOrderByCreatedAtDescIdDesc();
    }

    /**
     * Complete Multi-Module Transaction Workflow:
     * Validation -> Risk Engine -> Fraud Check -> Settlement -> Balance Update -> Statement -> Notification -> Audit Trail
     */
    @Transactional
    public Transaction addTransaction(OperationsDtos.CreateTransactionRequest request) {
        if (request.amount() == null || request.amount().signum() <= 0) {
            throw new IllegalArgumentException("Transaction amount must be positive");
        }

        Long customerId = request.customerId() != null ? request.customerId() : 1L;
        String type = request.type() != null ? request.type().toUpperCase() : "FUND_TRANSFER";
        boolean isDebit = "DEBIT".equalsIgnoreCase(type)
                || "WITHDRAWAL".equalsIgnoreCase(type)
                || "CASH_WITHDRAWAL".equalsIgnoreCase(type)
                || "INTERNATIONAL_WIRE".equalsIgnoreCase(type)
                || "CRYPTO_EXCHANGE".equalsIgnoreCase(type)
                || "FUND_TRANSFER".equalsIgnoreCase(type)
                || "PAYMENT".equalsIgnoreCase(type);

        // 1. Account & Balance Validation
        Account senderAccount = null;
        if (request.accountId() != null) {
            senderAccount = accountRepo.findById(request.accountId()).orElse(null);
        }
        if (senderAccount == null && customerId != null) {
            List<Account> accs = accountRepo.findByCustomerId(customerId);
            if (!accs.isEmpty()) {
                senderAccount = accs.get(0);
            }
        }

        if (senderAccount != null) {
            if ("FROZEN".equalsIgnoreCase(senderAccount.getStatus()) || "CLOSED".equalsIgnoreCase(senderAccount.getStatus())) {
                throw new IllegalStateException("Account " + senderAccount.getAccountNumber() + " is " + senderAccount.getStatus() + ". Transactions are not permitted.");
            }
            if (isDebit && senderAccount.getBalance().compareTo(request.amount()) < 0) {
                throw new IllegalArgumentException("Insufficient funds in account " + senderAccount.getAccountNumber() + ". Current balance: ₹" + senderAccount.getBalance());
            }
        }

        // 2. Risk & Fraud Assessment Calculation
        int fraudScore = 0;
        List<String> riskReasons = new ArrayList<>();

        if (request.amount().compareTo(new BigDecimal("500000")) >= 0) {
            fraudScore += 40;
            riskReasons.add("Critical high-value transfer (>= ₹5,00,000)");
        } else if (request.amount().compareTo(new BigDecimal("100000")) >= 0) {
            fraudScore += 25;
            riskReasons.add("High-value transaction amount (>= ₹1,00,000)");
        } else if (request.amount().compareTo(new BigDecimal("50000")) >= 0) {
            fraudScore += 10;
            riskReasons.add("Moderate-value transaction (>= ₹50,000)");
        }

        if ("INTERNATIONAL_WIRE".equalsIgnoreCase(type) || "CRYPTO_EXCHANGE".equalsIgnoreCase(type)) {
            fraudScore += 30;
            riskReasons.add("High-risk transaction classification: " + type);
        }

        if (request.location() != null && (request.location().toLowerCase().contains("london")
                || request.location().toLowerCase().contains("dubai")
                || request.location().toLowerCase().contains("foreign"))) {
            fraudScore += 25;
            riskReasons.add("Cross-border geolocation flagged: " + request.location());
        }

        if (riskReasons.isEmpty()) {
            riskReasons.add("Standard regular transaction baseline activity");
        }
        if (fraudScore > 100) fraudScore = 100;

        String txnStatus;
        String threatLevel;
        if (fraudScore >= 75) {
            txnStatus = "BLOCKED";
            threatLevel = "CRITICAL";
        } else if (fraudScore >= 50) {
            txnStatus = "UNDER_REVIEW";
            threatLevel = "HIGH";
        } else {
            txnStatus = "SUCCESS";
            threatLevel = fraudScore >= 25 ? "MEDIUM" : "LOW";
        }

        // 3. Create & Persist Transaction Record
        String ref = (request.transactionReference() != null && !request.transactionReference().isBlank())
                ? request.transactionReference().trim()
                : "TXN-" + System.currentTimeMillis() + "-" + (int) (Math.random() * 900 + 100);

        Transaction txn = new Transaction();
        txn.setTransactionReference(ref);
        txn.setCustomerId(customerId);
        txn.setLoanId(request.loanId() != null ? request.loanId() : 1L);
        txn.setAmount(request.amount());
        txn.setType(type);
        txn.setStatus(txnStatus);
        txn.setCreatedAt(LocalDateTime.now());
        Transaction savedTxn = transactionRepo.save(txn);

        // 4. Save Risk Assessment & Fraud Event
        String reasonStr = String.join("; ", riskReasons);
        RiskAssessment ra = new RiskAssessment(
                null,
                customerId,
                savedTxn.getId(),
                fraudScore,
                txnStatus,
                reasonStr.length() > 250 ? reasonStr.substring(0, 247) + "..." : reasonStr,
                LocalDateTime.now()
        );
        ra.setAmount(request.amount());
        ra.setTransactionType(type);
        ra.setLocation(request.location() != null ? request.location() : "Domestic / Web");
        ra.setRiskLevel(threatLevel);
        ra.setAssessmentStatus("COMPLETED");
        if (senderAccount != null) {
            ra.setAccountNumber(senderAccount.getAccountNumber());
            ra.setAccountType(senderAccount.getAccountType());
            ra.setAccountBalance(senderAccount.getBalance());
        }
        riskAssessmentRepo.save(ra);

        FraudEvent fe = new FraudEvent();
        fe.setUserId(customerId);
        fe.setTransactionId(savedTxn.getId());
        fe.setFraudScore(fraudScore);
        fe.setStatus(txnStatus);
        fe.setReason(reasonStr.length() > 250 ? reasonStr.substring(0, 247) + "..." : reasonStr);
        fe.setCreatedAt(LocalDateTime.now());
        fraudEventRepo.save(fe);

        // 5. If SAFE (SUCCESS) -> Execute Settlement & Update Balance & Statements
        if ("SUCCESS".equalsIgnoreCase(txnStatus)) {
            if (senderAccount != null) {
                BigDecimal newSenderBal = senderAccount.getBalance().subtract(request.amount());
                senderAccount.setBalance(newSenderBal);
                accountRepo.save(senderAccount);

                AccountStatement senderStmt = new AccountStatement();
                senderStmt.setAccountId(senderAccount.getId());
                senderStmt.setReference(savedTxn.getTransactionReference());
                senderStmt.setEntryType("DEBIT");
                senderStmt.setAmount(request.amount());
                senderStmt.setBalanceAfter(newSenderBal);
                senderStmt.setDescription(request.description() != null ? request.description() : "Transfer / Payment #" + savedTxn.getTransactionReference());
                senderStmt.setCreatedAt(LocalDateTime.now());
                statementRepo.save(senderStmt);
            }

            // Target account credit if specified
            if (request.targetAccountId() != null) {
                final String senderAccNo = senderAccount != null ? senderAccount.getAccountNumber() : "transfer";
                accountRepo.findById(request.targetAccountId()).ifPresent(targetAcc -> {
                    BigDecimal newTargetBal = targetAcc.getBalance().add(request.amount());
                    targetAcc.setBalance(newTargetBal);
                    accountRepo.save(targetAcc);

                    AccountStatement targetStmt = new AccountStatement();
                    targetStmt.setAccountId(targetAcc.getId());
                    targetStmt.setReference(savedTxn.getTransactionReference());
                    targetStmt.setEntryType("CREDIT");
                    targetStmt.setAmount(request.amount());
                    targetStmt.setBalanceAfter(newTargetBal);
                    targetStmt.setDescription("Credit received from " + senderAccNo + " ref #" + savedTxn.getTransactionReference());
                    targetStmt.setCreatedAt(LocalDateTime.now());
                    statementRepo.save(targetStmt);

                    notificationService.notifyCustomer(
                            targetAcc.getCustomerId(),
                            "Payment Credited",
                            "Dear Customer, your account " + targetAcc.getAccountNumber() + " has been credited with ₹" + request.amount() + ". Balance: ₹" + newTargetBal
                    );
                });
            }

            // Record Settlement
            Settlement settlement = new Settlement();
            settlement.setTransactionId(savedTxn.getId());
            settlement.setLoanId(savedTxn.getLoanId());
            settlement.setSettledAmount(request.amount());
            settlement.setStatus("SETTLED");
            settlement.setSettledAt(LocalDateTime.now());
            settlementRepo.save(settlement);

            // Send notification to customer
            notificationService.notifyCustomer(
                    customerId,
                    "Transaction Debited",
                    "Dear Customer, ₹" + request.amount() + " debited from " + (senderAccount != null ? senderAccount.getAccountNumber() : "account") + " for " + type + " ref " + savedTxn.getTransactionReference() + ". Available Bal: ₹" + (senderAccount != null ? senderAccount.getBalance() : "N/A")
            );

            auditLogService.record(
                    customerId,
                    "CUSTOMER",
                    "TRANSACTION_SETTLED",
                    "OPERATIONS",
                    "TRANSACTION",
                    savedTxn.getTransactionReference(),
                    "Transaction cleared and settled: ₹" + request.amount() + " (" + type + ")",
                    "SUCCESS",
                    null
            );
        } else if ("UNDER_REVIEW".equalsIgnoreCase(txnStatus)) {
            notificationService.notifyCustomer(
                    customerId,
                    "Transaction Security Verification",
                    "FinCore Security Alert: Transaction " + savedTxn.getTransactionReference() + " for ₹" + request.amount() + " is currently under review by our fraud prevention team."
            );

            auditLogService.record(
                    customerId,
                    "FRAUD_ENGINE",
                    "TRANSACTION_HELD_FOR_REVIEW",
                    "FRAUD_DETECTION",
                    "TRANSACTION",
                    savedTxn.getTransactionReference(),
                    "Transaction held for manual fraud review. Score: " + fraudScore + "/100",
                    "UNDER_REVIEW",
                    null
            );
        } else {
            notificationService.notifyCustomer(
                    customerId,
                    "Transaction Blocked Alert",
                    "CRITICAL ALERT: Transaction " + savedTxn.getTransactionReference() + " for ₹" + request.amount() + " was blocked due to abnormal security indicators."
            );

            auditLogService.record(
                    customerId,
                    "FRAUD_ENGINE",
                    "TRANSACTION_BLOCKED",
                    "FRAUD_DETECTION",
                    "TRANSACTION",
                    savedTxn.getTransactionReference(),
                    "Transaction blocked due to high fraud risk score " + fraudScore + "/100: " + reasonStr,
                    "BLOCKED",
                    null
            );
        }

        return savedTxn;
    }

    /**
     * Customer Loan Application
     */
    @Transactional
    public Loan applyLoan(OperationsDtos.ApplyLoanRequest request) {
        if (request.amount() == null || request.amount().signum() <= 0) {
            throw new IllegalArgumentException("Loan amount must be greater than zero");
        }

        Long customerId = request.customerId() != null ? request.customerId() : 1L;
        BigDecimal interestRate = request.interestRate() != null ? request.interestRate() : BigDecimal.valueOf(9.5);
        int tenure = request.tenureMonths() > 0 ? request.tenureMonths() : 60;

        Loan loan = new Loan();
        loan.setCustomerId(customerId);
        loan.setPrincipalOutstanding(request.amount());
        loan.setInterestOutstanding(request.amount().multiply(interestRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
        loan.setPenaltyOutstanding(BigDecimal.ZERO);
        loan.setTotalOutstanding(request.amount().add(loan.getInterestOutstanding()));
        loan.setStatus("PENDING_APPROVAL");
        Loan saved = loanRepo.save(loan);

        // Generate preliminary EMI Schedule
        OperationsDtos.EmiResult emiResult = calculateEmi(new OperationsDtos.EmiRequest(request.amount(), interestRate, tenure));
        LocalDate nextDueDate = LocalDate.now().plusMonths(1);
        List<LoanSchedule> schedules = new ArrayList<>();
        for (int i = 1; i <= Math.min(tenure, 12); i++) {
            LoanSchedule ls = new LoanSchedule();
            ls.setLoanId(saved.getId());
            ls.setInstallmentNumber(i);
            ls.setDueDate(nextDueDate.plusMonths(i - 1));
            ls.setTotalDue(emiResult.emi());
            ls.setPrincipalDue(emiResult.emi().multiply(BigDecimal.valueOf(0.7)).setScale(2, RoundingMode.HALF_UP));
            ls.setInterestDue(emiResult.emi().multiply(BigDecimal.valueOf(0.3)).setScale(2, RoundingMode.HALF_UP));
            ls.setStatus("PENDING");
            schedules.add(ls);
        }
        scheduleRepo.saveAll(schedules);

        notificationService.notifyCustomer(
                customerId,
                "Loan Application Submitted",
                "Dear Customer, your loan application #" + saved.getId() + " of ₹" + request.amount() + " has been submitted for review. Status: PENDING_APPROVAL."
        );

        auditLogService.record(
                customerId,
                "CUSTOMER",
                "LOAN_APPLICATION_SUBMITTED",
                "LOAN_MANAGEMENT",
                "LOAN",
                saved.getId().toString(),
                "New loan application submitted for ₹" + request.amount() + " (Tenure: " + tenure + " months)",
                "SUCCESS",
                null
        );

        return saved;
    }

    /**
     * Loan Officer Loan Approval
     */
    @Transactional
    public Loan approveLoan(Long loanId) {
        Loan loan = loanRepo.findById(loanId).orElseThrow(() -> new IllegalArgumentException("Loan not found"));
        loan.setStatus("APPROVED");
        Loan saved = loanRepo.save(loan);

        notificationService.notifyCustomer(
                loan.getCustomerId(),
                "Loan Approved",
                "Congratulations! Your loan #" + loan.getId() + " for ₹" + loan.getPrincipalOutstanding() + " has been APPROVED by the Loan Officer."
        );

        auditLogService.record(
                loan.getCustomerId(),
                "LOAN_OFFICER",
                "LOAN_APPROVED",
                "LOAN_MANAGEMENT",
                "LOAN",
                loan.getId().toString(),
                "Loan application approved by Loan Officer",
                "SUCCESS",
                null
        );

        return saved;
    }

    /**
     * Loan Officer Loan Rejection
     */
    @Transactional
    public Loan rejectLoan(Long loanId, String remarks) {
        Loan loan = loanRepo.findById(loanId).orElseThrow(() -> new IllegalArgumentException("Loan not found"));
        loan.setStatus("REJECTED");
        Loan saved = loanRepo.save(loan);

        notificationService.notifyCustomer(
                loan.getCustomerId(),
                "Loan Application Update",
                "Dear Customer, your loan application #" + loan.getId() + " could not be approved. Reason: " + (remarks != null ? remarks : "Credit policy criteria not met.")
        );

        auditLogService.record(
                loan.getCustomerId(),
                "LOAN_OFFICER",
                "LOAN_REJECTED",
                "LOAN_MANAGEMENT",
                "LOAN",
                loan.getId().toString(),
                "Loan application rejected. Remarks: " + remarks,
                "REJECTED",
                null
        );

        return saved;
    }

    public List<LoanDisbursement> disbursements() { return disbursementRepo.findAll(); }

    /**
     * Loan Officer Disbursement Flow:
     * Validates Approved Status -> Disburses -> Credits Customer Account -> Updates Balance -> Creates Statement & Notification -> Audit
     */
    @Transactional
    public LoanDisbursement disburse(OperationsDtos.DisbursementRequest request) {
        Loan loan = loanRepo.findById(request.loanId()).orElseThrow(() -> new IllegalArgumentException("Loan not found"));
        
        if ("REJECTED".equalsIgnoreCase(loan.getStatus())) {
            throw new IllegalStateException("Cannot disburse a REJECTED loan.");
        }
        if ("DISBURSED".equalsIgnoreCase(loan.getStatus()) && loan.getPrincipalOutstanding().compareTo(BigDecimal.ZERO) == 0) {
            throw new IllegalStateException("Loan has already been fully disbursed.");
        }

        BigDecimal amount = request.amount() != null ? request.amount() : loan.getPrincipalOutstanding();
        if (amount == null || amount.signum() <= 0) {
            throw new IllegalArgumentException("Disbursement amount must be positive");
        }

        // 1. Record Disbursement
        String disbRef = "DISB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        LoanDisbursement item = new LoanDisbursement();
        item.setLoanId(loan.getId());
        item.setAmount(amount);
        item.setChannel(request.channel() != null ? request.channel() : "RTGS / NEFT");
        item.setReference(disbRef);
        item.setStatus("COMPLETED");
        item.setDisbursedAt(LocalDateTime.now());
        LoanDisbursement saved = disbursementRepo.save(item);

        loan.setStatus("ACTIVE");
        loanRepo.save(loan);

        // 2. Credit Customer Account Balance
        Account customerAccount = null;
        if (request.beneficiaryAccountId() != null) {
            customerAccount = accountRepo.findById(request.beneficiaryAccountId()).orElse(null);
        }
        if (customerAccount == null && loan.getCustomerId() != null) {
            List<Account> accs = accountRepo.findByCustomerId(loan.getCustomerId());
            if (!accs.isEmpty()) {
                customerAccount = accs.get(0);
            }
        }

        if (customerAccount != null) {
            BigDecimal newBal = customerAccount.getBalance().add(amount);
            customerAccount.setBalance(newBal);
            accountRepo.save(customerAccount);

            // 3. Create Statement Entry
            AccountStatement statement = new AccountStatement();
            statement.setAccountId(customerAccount.getId());
            statement.setReference(disbRef);
            statement.setEntryType("CREDIT");
            statement.setAmount(amount);
            statement.setBalanceAfter(newBal);
            statement.setDescription("Loan Disbursement Credit #" + loan.getId() + " - Ref: " + disbRef);
            statement.setCreatedAt(LocalDateTime.now());
            statementRepo.save(statement);
        }

        // 4. Send Central Notification
        notificationService.notifyCustomer(
                loan.getCustomerId(),
                "Loan Disbursement Credited",
                "Dear Customer, loan disbursement ₹" + amount + " has been successfully credited to your account. Ref: " + disbRef
        );

        // 5. Audit Trail
        auditLogService.record(
                loan.getCustomerId(),
                "LOAN_OFFICER",
                "LOAN_DISBURSED",
                "LOAN_MANAGEMENT",
                "LOAN",
                loan.getId().toString(),
                "Loan disbursed ₹" + amount + " to account " + (customerAccount != null ? customerAccount.getAccountNumber() : "beneficiary"),
                "SUCCESS",
                null
        );

        return saved;
    }

    public List<LoanCollection> collections() { return collectionRepo.findAll(); }

    /**
     * Repayment & Collection Flow
     */
    @Transactional
    public LoanCollection collect(OperationsDtos.CollectionRequest request) {
        Loan loan = loanRepo.findById(request.loanId()).orElseThrow(() -> new IllegalArgumentException("Loan not found"));
        if (request.amount() == null || request.amount().signum() <= 0) {
            throw new IllegalArgumentException("Collection payment amount must be positive");
        }

        // If paid from internal account, debit balance
        Account sourceAcc = null;
        if (request.sourceAccountId() != null) {
            sourceAcc = accountRepo.findById(request.sourceAccountId()).orElse(null);
        } else if (loan.getCustomerId() != null) {
            List<Account> accs = accountRepo.findByCustomerId(loan.getCustomerId());
            if (!accs.isEmpty()) sourceAcc = accs.get(0);
        }

        String colRef = "COL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        if (sourceAcc != null && "AUTO_DEBIT".equalsIgnoreCase(request.channel())) {
            if (sourceAcc.getBalance().compareTo(request.amount()) >= 0) {
                BigDecimal newBal = sourceAcc.getBalance().subtract(request.amount());
                sourceAcc.setBalance(newBal);
                accountRepo.save(sourceAcc);

                AccountStatement stmt = new AccountStatement();
                stmt.setAccountId(sourceAcc.getId());
                stmt.setReference(colRef);
                stmt.setEntryType("DEBIT");
                stmt.setAmount(request.amount());
                stmt.setBalanceAfter(newBal);
                stmt.setDescription("Loan EMI auto-debit for Loan #" + loan.getId());
                stmt.setCreatedAt(LocalDateTime.now());
                statementRepo.save(stmt);
            }
        }

        // Deduct from outstanding loan balance
        BigDecimal newOutstanding = loan.getTotalOutstanding().subtract(request.amount()).max(BigDecimal.ZERO);
        loan.setTotalOutstanding(newOutstanding);
        if (loan.getPrincipalOutstanding() != null) {
            loan.setPrincipalOutstanding(loan.getPrincipalOutstanding().subtract(request.amount().multiply(BigDecimal.valueOf(0.7))).max(BigDecimal.ZERO));
        }
        loanRepo.save(loan);

        LoanCollection item = new LoanCollection();
        item.setLoanId(loan.getId());
        item.setScheduleId(request.scheduleId() != null ? request.scheduleId() : 1L);
        item.setAmount(request.amount());
        item.setChannel(request.channel() != null ? request.channel() : "UPI");
        item.setReference(colRef);
        item.setStatus("RECEIVED");
        item.setCollectedAt(LocalDateTime.now());
        LoanCollection saved = collectionRepo.save(item);

        notificationService.notifyCustomer(
                loan.getCustomerId(),
                "Loan Repayment Received",
                "Dear Customer, we have received your loan payment of ₹" + request.amount() + " for Loan #" + loan.getId() + ". Remaining Outstanding: ₹" + newOutstanding
        );

        auditLogService.record(
                loan.getCustomerId(),
                "COLLECTIONS",
                "LOAN_REPAYMENT_COLLECTED",
                "LOAN_MANAGEMENT",
                "LOAN",
                loan.getId().toString(),
                "EMI installment received ₹" + request.amount() + " via " + item.getChannel(),
                "SUCCESS",
                null
        );

        return saved;
    }

    @Transactional
    public Loan markOverdue(Long loanId, String reason) {
        Loan loan = loanRepo.findById(loanId).orElseThrow(() -> new IllegalArgumentException("Loan not found"));
        loan.setStatus("OVERDUE");
        BigDecimal penalty = BigDecimal.valueOf(500);
        loan.setPenaltyOutstanding((loan.getPenaltyOutstanding() != null ? loan.getPenaltyOutstanding() : BigDecimal.ZERO).add(penalty));
        loan.setTotalOutstanding(loan.getTotalOutstanding().add(penalty));
        Loan saved = loanRepo.save(loan);

        notificationService.notifyCustomer(
                loan.getCustomerId(),
                "URGENT: Loan EMI Overdue Notice",
                "Dear Customer, your EMI for Loan #" + loan.getId() + " is past due. A late penalty of ₹500 has been applied. Please clear the outstanding balance immediately."
        );

        auditLogService.record(
                loan.getCustomerId(),
                "COLLECTIONS_ENGINE",
                "LOAN_MARKED_OVERDUE",
                "LOAN_MANAGEMENT",
                "LOAN",
                loan.getId().toString(),
                "Loan marked OVERDUE. Penalty ₹500 added. Reason: " + (reason != null ? reason : "Payment due date elapsed without settlement"),
                "OVERDUE",
                null
        );

        return saved;
    }

    public Account addAccount(OperationsDtos.CreateAccountRequest request) {
        Account account = new Account();
        account.setAccountNumber(request.accountNumber() != null ? request.accountNumber() : "ACC-" + (int)(Math.random() * 9000 + 1000));
        account.setCustomerId(request.customerId() != null ? request.customerId() : 1L);
        account.setAccountType(request.accountType() != null ? request.accountType() : "SAVINGS");
        account.setBalance(request.initialBalance() != null ? request.initialBalance() : BigDecimal.ZERO);
        account.setStatus(request.status() != null ? request.status().toUpperCase() : "ACTIVE");
        account.setOpenedAt(LocalDate.now());
        Account saved = accountRepo.save(account);

        notificationService.notifyCustomer(
                saved.getCustomerId(),
                "Account Created",
                "Welcome to FinCore! Your " + saved.getAccountType() + " account " + saved.getAccountNumber() + " has been activated."
        );

        auditLogService.record(
                saved.getCustomerId(),
                "OPERATIONS",
                "ACCOUNT_CREATED",
                "OPERATIONS",
                "ACCOUNT",
                saved.getId().toString(),
                "Account created #" + saved.getAccountNumber() + " with opening balance ₹" + saved.getBalance(),
                "SUCCESS",
                null
        );
        return saved;
    }

    public Customer addCustomer(OperationsDtos.CustomerRequest request) {
        if (request.fullName() == null || request.fullName().isBlank() || request.email() == null || request.email().isBlank() || request.phoneNumber() == null || request.phoneNumber().isBlank()) {
            throw new IllegalArgumentException("Name, email, and phone number are required");
        }
        Customer customer = new Customer();
        if (request.customerId() != null && request.customerId() > 0) {
            customer.setId(request.customerId());
        }
        customer.setFullName(request.fullName().trim());
        customer.setEmail(request.email().trim());
        customer.setPhoneNumber(request.phoneNumber().trim());
        customer.setAccountNumber(request.accountNumber());
        customer.setDateOfBirth(request.dateOfBirth() != null ? request.dateOfBirth() : LocalDate.of(1995, 8, 15));
        customer.setCreatedAt(LocalDateTime.now());
        Customer saved = customerRepo.save(customer);

        auditLogService.record(
                saved.getId(),
                "OPERATIONS",
                "CUSTOMER_CREATED",
                "OPERATIONS",
                "CUSTOMER",
                saved.getId().toString(),
                "Customer profile created for " + saved.getFullName(),
                "SUCCESS",
                null
        );
        return saved;
    }

    public List<AccountStatement> statement(Long accountId) {
        return statementRepo.findByAccountIdOrderByCreatedAtDesc(accountId);
    }

    @Transactional
    public Account updateLifecycle(Long accountId, String status) {
        Account account = accountRepo.findById(accountId).orElseThrow(() -> new IllegalArgumentException("Account not found"));
        account.setStatus(status.toUpperCase());
        Account saved = accountRepo.save(account);

        notificationService.notifyCustomer(
                saved.getCustomerId(),
                "Account Status Update",
                "Notice: Your account " + saved.getAccountNumber() + " status is now " + saved.getStatus() + "."
        );

        auditLogService.record(
                saved.getCustomerId(),
                "OPERATIONS",
                "ACCOUNT_STATUS_UPDATED",
                "OPERATIONS",
                "ACCOUNT",
                accountId.toString(),
                "Account status transitioned to " + status,
                "SUCCESS",
                null
        );
        return saved;
    }

    @Transactional
    public Account adjustBalance(Long accountId, OperationsDtos.BalanceAdjustmentRequest request) {
        Account account = accountRepo.findById(accountId).orElseThrow(() -> new IllegalArgumentException("Account not found"));
        if (request.amount() == null || request.amount().signum() <= 0) throw new IllegalArgumentException("Amount must be positive");
        BigDecimal signedAmount = "DEBIT".equalsIgnoreCase(request.entryType()) ? request.amount().negate() : request.amount();
        BigDecimal updatedBalance = account.getBalance().add(signedAmount);
        if (updatedBalance.signum() < 0) throw new IllegalArgumentException("Insufficient account balance");
        account.setBalance(updatedBalance);
        
        AccountStatement entry = new AccountStatement();
        entry.setAccountId(accountId);
        entry.setReference("ADJ-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        entry.setEntryType(request.entryType().toUpperCase());
        entry.setAmount(request.amount());
        entry.setBalanceAfter(updatedBalance);
        entry.setDescription(request.description() != null ? request.description() : "Manual counter adjustment");
        entry.setCreatedAt(LocalDateTime.now());
        statementRepo.save(entry);
        
        Account saved = accountRepo.save(account);

        notificationService.notifyCustomer(
                saved.getCustomerId(),
                "Balance Adjusted",
                "Your account " + saved.getAccountNumber() + " has been " + (signedAmount.signum() > 0 ? "credited" : "debited") + " with ₹" + request.amount() + ". Balance: ₹" + updatedBalance
        );

        auditLogService.record(
                saved.getCustomerId(),
                "OPERATIONS",
                "BALANCE_UPDATED",
                "OPERATIONS",
                "ACCOUNT",
                accountId.toString(),
                "Account balance adjusted: " + request.entryType() + " ₹" + request.amount(),
                "SUCCESS",
                null
        );
        return saved;
    }

    public OperationsDtos.EmiResult calculateEmi(OperationsDtos.EmiRequest request) {
        if (request.principal() == null || request.annualRate() == null || request.principal().signum() <= 0 || request.tenureMonths() <= 0) {
            throw new IllegalArgumentException("Principal and tenure must be positive");
        }
        BigDecimal monthlyRate = request.annualRate().divide(BigDecimal.valueOf(1200), 12, RoundingMode.HALF_UP);
        double rate = monthlyRate.doubleValue();
        double principal = request.principal().doubleValue();
        double emi = rate == 0 ? principal / request.tenureMonths() : principal * rate * Math.pow(1 + rate, request.tenureMonths()) / (Math.pow(1 + rate, request.tenureMonths()) - 1);
        BigDecimal monthlyEmi = BigDecimal.valueOf(emi).setScale(2, RoundingMode.HALF_UP);
        BigDecimal payable = monthlyEmi.multiply(BigDecimal.valueOf(request.tenureMonths())).setScale(2, RoundingMode.HALF_UP);
        return new OperationsDtos.EmiResult(monthlyEmi, payable.subtract(request.principal()).setScale(2, RoundingMode.HALF_UP), payable);
    }
}
