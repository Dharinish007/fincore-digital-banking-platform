package com.example.milestone2loanmanagement.client;

import com.example.milestone2loanmanagement.client.DTO.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "milestone-3",
url="http://localhost:8082")
public interface NotificationClient {
    @PostMapping("/api/notification/email")
    String sendEmail(@RequestBody NotificationRequest dto);

}
