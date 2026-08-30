package com.bankingsystem.disbursementsaga.client;

import com.bankingsystem.disbursementsaga.dto.AuditLogRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AuditTrailClient {

    private static final Logger log = LoggerFactory.getLogger(AuditTrailClient.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public AuditTrailClient(RestTemplate restTemplate,
                            @Value("${services.audit.base-url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public void log(AuditLogRequest request) {
        try {
            restTemplate.postForObject(baseUrl + "/api/audit-logs", request, Void.class);
        } catch (Exception e) {
            log.error("Audit log write failed: {}", e.getMessage());
        }
    }
}
