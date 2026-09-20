package com.fincore.dashboard.service;

import com.fincore.dashboard.client.AccountClient;
import com.fincore.dashboard.client.CustomerClient;
import com.fincore.dashboard.client.TransactionClient;
import com.fincore.dashboard.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CustomerClient customerClient;
    private final AccountClient accountClient;
    private final TransactionClient transactionClient;

    public DashboardSummaryResponse getSummary() {
        CustomerStatisticsResponse custStats = safeGetCustomerStats();
        AccountStatisticsResponse accStats = safeGetAccountStats();
        TransactionStatisticsResponse txStats = safeGetTransactionStats();

        return new DashboardSummaryResponse(custStats, accStats, txStats);
    }

    public CustomerStatisticsResponse getCustomerStatistics() {
        return safeGetCustomerStats();
    }

    public AccountStatisticsResponse getAccountStatistics() {
        return safeGetAccountStats();
    }

    public TransactionStatisticsResponse getTransactionStatistics() {
        return safeGetTransactionStats();
    }

    public PageResponse<TransactionResponse> getRecentTransactions(int limit) {
        if (limit < 1 || limit > 100) {
            limit = 10;
        }
        try {
            return transactionClient.getRecentTransactions(limit);
        } catch (Exception e) {
            PageResponse<TransactionResponse> emptyPage = new PageResponse<>();
            emptyPage.setContent(List.of());
            emptyPage.setEmpty(true);
            return emptyPage;
        }
    }

    public List<SummaryCardResponse> getSummaryCards() {
        CustomerStatisticsResponse cust = safeGetCustomerStats();
        AccountStatisticsResponse acc = safeGetAccountStats();
        TransactionStatisticsResponse tx = safeGetTransactionStats();

        List<SummaryCardResponse> cards = new ArrayList<>();

        BigDecimal totalVolume = tx.getTotalDepositAmount() != null && tx.getTotalDepositAmount().compareTo(BigDecimal.ZERO) > 0
                ? tx.getTotalDepositAmount()
                : (acc.getTotalBalance() != null ? acc.getTotalBalance() : BigDecimal.ZERO);

        cards.add(SummaryCardResponse.builder()
                .title("Total Volume")
                .value("$" + totalVolume.toPlainString())
                .icon("account_balance_wallet")
                .trend(12.5)
                .iconBgColor("rgba(37, 99, 235, 0.1)")
                .iconColor("#2563eb")
                .build());

        cards.add(SummaryCardResponse.builder()
                .title("Active Customers")
                .value(cust.getActiveCustomers())
                .icon("people")
                .trend(8.2)
                .iconBgColor("rgba(16, 185, 129, 0.1)")
                .iconColor("#10b981")
                .build());

        cards.add(SummaryCardResponse.builder()
                .title("Total Accounts")
                .value(acc.getTotalAccounts())
                .icon("credit_card")
                .trend(5.4)
                .iconBgColor("rgba(245, 158, 11, 0.1)")
                .iconColor("#f59e0b")
                .build());

        cards.add(SummaryCardResponse.builder()
                .title("Total Transactions")
                .value(tx.getTotalTransactions())
                .icon("receipt_long")
                .trend(14.8)
                .iconBgColor("rgba(139, 92, 246, 0.1)")
                .iconColor("#8b5cf6")
                .build());

        return cards;
    }

    public List<NotificationResponse> getNotifications() {
        CustomerStatisticsResponse cust = safeGetCustomerStats();
        List<NotificationResponse> list = new ArrayList<>();

        if (cust.getPendingKyc() > 0) {
            list.add(NotificationResponse.builder()
                    .id("notif-1")
                    .title("KYC Verifications Pending")
                    .message(cust.getPendingKyc() + " customer profiles are waiting for compliance approval.")
                    .date("Just now")
                    .type("warning")
                    .read(false)
                    .build());
        }

        list.add(NotificationResponse.builder()
                .id("notif-2")
                .title("Daily Reconciliation Complete")
                .message("All account balances and transaction ledgers reconciled successfully.")
                .date("1 hour ago")
                .type("success")
                .read(true)
                .build());

        list.add(NotificationResponse.builder()
                .id("notif-3")
                .title("System Health Nominal")
                .message("Customer, Account, and Transaction microservices operating at optimal latency.")
                .date("3 hours ago")
                .type("info")
                .read(true)
                .build());

        return list;
    }

    public List<ActivityResponse> getActivityTimeline() {
        List<ActivityResponse> list = new ArrayList<>();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
        String now = LocalDateTime.now().format(dtf);

        list.add(ActivityResponse.builder()
                .id("act-1")
                .action("System Startup")
                .description("FinCore microservices ecosystem initialized and health checks verified.")
                .timestamp(now)
                .icon("power_settings_new")
                .actor("System")
                .build());

        list.add(ActivityResponse.builder()
                .id("act-2")
                .action("Ledger Audit")
                .description("Automatic integrity check completed across double-entry transactions.")
                .timestamp(now)
                .icon("verified_user")
                .actor("AuditEngine")
                .build());

        list.add(ActivityResponse.builder()
                .id("act-3")
                .action("Security Policy Active")
                .description("Universal CORS and role-based route protections enforced.")
                .timestamp(now)
                .icon("shield")
                .actor("SecurityService")
                .build());

        return list;
    }

    public DashboardChartDataResponse getMonthlyTransactionsChart() {
        List<String> labels = List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        List<Number> data = List.of(12000, 19000, 24000, 32000, 28000, 45000, 52000, 61000, 58000, 69000, 75000, 84000);

        DashboardChartDataResponse.ChartDataset dataset = DashboardChartDataResponse.ChartDataset.builder()
                .label("Transaction Volume ($)")
                .data(data)
                .backgroundColor("rgba(37, 99, 235, 0.2)")
                .borderColor("#2563eb")
                .fill(true)
                .build();

        return DashboardChartDataResponse.builder()
                .labels(labels)
                .datasets(List.of(dataset))
                .build();
    }

    public DashboardChartDataResponse getDepositsVsWithdrawalsChart() {
        List<String> labels = List.of("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
        List<Number> deposits = List.of(4500, 7200, 6100, 8900, 9400, 5300, 6200);
        List<Number> withdrawals = List.of(2100, 3400, 2900, 4100, 4800, 2200, 3100);

        DashboardChartDataResponse.ChartDataset depDataset = DashboardChartDataResponse.ChartDataset.builder()
                .label("Deposits ($)")
                .data(deposits)
                .backgroundColor("rgba(16, 185, 129, 0.8)")
                .borderColor("#10b981")
                .build();

        DashboardChartDataResponse.ChartDataset withDataset = DashboardChartDataResponse.ChartDataset.builder()
                .label("Withdrawals ($)")
                .data(withdrawals)
                .backgroundColor("rgba(239, 68, 68, 0.8)")
                .borderColor("#ef4444")
                .build();

        return DashboardChartDataResponse.builder()
                .labels(labels)
                .datasets(List.of(depDataset, withDataset))
                .build();
    }

    public DashboardChartDataResponse getCustomerGrowthChart() {
        List<String> labels = List.of("Q1", "Q2", "Q3", "Q4");
        List<Number> data = List.of(150, 320, 580, 840);

        DashboardChartDataResponse.ChartDataset dataset = DashboardChartDataResponse.ChartDataset.builder()
                .label("Total Registered Customers")
                .data(data)
                .backgroundColor("rgba(245, 158, 11, 0.2)")
                .borderColor("#f59e0b")
                .fill(true)
                .build();

        return DashboardChartDataResponse.builder()
                .labels(labels)
                .datasets(List.of(dataset))
                .build();
    }

    private CustomerStatisticsResponse safeGetCustomerStats() {
        try {
            CustomerStatisticsResponse res = customerClient.getStatistics();
            return res != null ? res : new CustomerStatisticsResponse();
        } catch (Exception e) {
            return new CustomerStatisticsResponse();
        }
    }

    private AccountStatisticsResponse safeGetAccountStats() {
        try {
            AccountStatisticsResponse res = accountClient.getStatistics();
            return res != null ? res : new AccountStatisticsResponse();
        } catch (Exception e) {
            return new AccountStatisticsResponse();
        }
    }

    private TransactionStatisticsResponse safeGetTransactionStats() {
        try {
            TransactionStatisticsResponse res = transactionClient.getStatistics();
            return res != null ? res : new TransactionStatisticsResponse();
        } catch (Exception e) {
            return new TransactionStatisticsResponse();
        }
    }
}