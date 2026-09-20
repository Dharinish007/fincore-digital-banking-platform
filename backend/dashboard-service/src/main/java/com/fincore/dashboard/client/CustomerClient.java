package com.fincore.dashboard.client;

import com.fincore.dashboard.dto.CustomerStatisticsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "customer-service",
        url = "${services.customer-service.url}"
)
public interface CustomerClient {

    @GetMapping("/api/v1/customers/statistics")
    CustomerStatisticsResponse getStatistics();
}