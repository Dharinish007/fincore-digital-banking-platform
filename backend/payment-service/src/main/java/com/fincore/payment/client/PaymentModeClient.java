package com.fincore.payment.client;

import com.fincore.payment.client.dto.PaymentModeClientRequest;
import com.fincore.payment.client.dto.PaymentModeClientResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.Optional;

@Component
public class PaymentModeClient {

    private static final Logger log = LoggerFactory.getLogger(PaymentModeClient.class);

    private final RestClient restClient;

    public PaymentModeClient(
            RestClient.Builder builder,
            @Value("${services.imps-neft-upi-service.url:http://localhost:8088/api/v1/payment-modes}") String paymentModeServiceUrl) {
        this.restClient = builder.baseUrl(paymentModeServiceUrl).build();
    }

    public Optional<PaymentModeClientResponse> processPaymentMode(PaymentModeClientRequest request) {
        try {
            PaymentModeClientResponse response = restClient.post()
                    .uri("/process")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(PaymentModeClientResponse.class);
            return Optional.ofNullable(response);
        } catch (RestClientResponseException e) {
            log.warn("Payment Mode service error: status={}, body={}", e.getStatusCode().value(), e.getResponseBodyAsString());
            PaymentModeClientResponse errorResponse = new PaymentModeClientResponse();
            errorResponse.setStatus("FAILED");
            errorResponse.setMessage("Payment processor failed with status " + e.getStatusCode().value());
            return Optional.of(errorResponse);
        } catch (Exception e) {
            log.info("Payment Mode service unreachable at configured URL (fallback mode): {}", e.getMessage());
            return Optional.empty();
        }
    }
}
