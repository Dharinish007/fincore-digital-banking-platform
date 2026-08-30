package com.fincore.kyc_service.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class NotificationClient {

    private static final Logger log = LoggerFactory.getLogger(NotificationClient.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public NotificationClient(RestTemplate restTemplate,
                              @Value("${services.notification.base-url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public void notify(String recipient, String type, String message) {
        try {
            restTemplate.postForObject(
                    baseUrl + "/api/notifications",
                    Map.of("recipient", recipient, "type", type, "message", message),
                    Void.class
            );
        } catch (Exception e) {
            log.error("Notification send failed: {}", e.getMessage());
        }
    }
}
