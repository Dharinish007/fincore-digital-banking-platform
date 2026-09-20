package com.fincore.dashboard.client;

import com.fincore.dashboard.dto.TransactionStatisticsResponse;
import com.fincore.dashboard.dto.TransactionResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.fincore.dashboard.dto.PageResponse;

@FeignClient(
        name = "transaction-service",
        url = "${services.transaction-service.url}"
)
public interface TransactionClient {

    @GetMapping("/api/v1/transactions/statistics")
    TransactionStatisticsResponse getStatistics();

    @GetMapping("/api/v1/transactions/recent")
    PageResponse<TransactionResponse> getRecentTransactions(
            @RequestParam(defaultValue = "10") int limit
    );
}