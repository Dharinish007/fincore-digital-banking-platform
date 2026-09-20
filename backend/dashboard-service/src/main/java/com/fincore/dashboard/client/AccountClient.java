package com.fincore.dashboard.client;

import com.fincore.dashboard.dto.AccountStatisticsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "account-service",
        url = "${services.account-service.url}"
)
public interface AccountClient {

    @GetMapping("/api/v1/accounts/statistics")
    AccountStatisticsResponse getStatistics();
}