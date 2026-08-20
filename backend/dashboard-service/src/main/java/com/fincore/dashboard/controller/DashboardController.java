package com.fincore.dashboard.controller;

import com.fincore.dashboard.dto.*;
import com.fincore.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/customer-statistics")
    public ResponseEntity<CustomerStatisticsResponse> getCustomerStatistics() {
        return ResponseEntity.ok(dashboardService.getCustomerStatistics());
    }

    @GetMapping("/account-statistics")
    public ResponseEntity<AccountStatisticsResponse> getAccountStatistics() {
        return ResponseEntity.ok(dashboardService.getAccountStatistics());
    }

    @GetMapping("/transaction-statistics")
    public ResponseEntity<TransactionStatisticsResponse> getTransactionStatistics() {
        return ResponseEntity.ok(dashboardService.getTransactionStatistics());
    }

    @GetMapping("/recent-transactions")
    public ResponseEntity<PageResponse<TransactionResponse>> getRecentTransactions(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(dashboardService.getRecentTransactions(limit));
    }

    @GetMapping("/summary-cards")
    public ResponseEntity<List<SummaryCardResponse>> getSummaryCards() {
        return ResponseEntity.ok(dashboardService.getSummaryCards());
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getNotifications() {
        return ResponseEntity.ok(dashboardService.getNotifications());
    }

    @GetMapping("/activity-timeline")
    public ResponseEntity<List<ActivityResponse>> getActivityTimeline() {
        return ResponseEntity.ok(dashboardService.getActivityTimeline());
    }

    @GetMapping("/charts/monthly-transactions")
    public ResponseEntity<DashboardChartDataResponse> getMonthlyTransactionsChart() {
        return ResponseEntity.ok(dashboardService.getMonthlyTransactionsChart());
    }

    @GetMapping("/charts/deposits-vs-withdrawals")
    public ResponseEntity<DashboardChartDataResponse> getDepositsVsWithdrawalsChart() {
        return ResponseEntity.ok(dashboardService.getDepositsVsWithdrawalsChart());
    }

    @GetMapping("/charts/customer-growth")
    public ResponseEntity<DashboardChartDataResponse> getCustomerGrowthChart() {
        return ResponseEntity.ok(dashboardService.getCustomerGrowthChart());
    }
}