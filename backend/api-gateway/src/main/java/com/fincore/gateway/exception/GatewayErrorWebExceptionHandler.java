package com.fincore.gateway.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.net.ConnectException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
@Order(-2)
public class GatewayErrorWebExceptionHandler implements ErrorWebExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GatewayErrorWebExceptionHandler.class);
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        ServerHttpResponse response = exchange.getResponse();

        if (response.isCommitted()) {
            return Mono.error(ex);
        }

        HttpStatus status;
        String errorMessage;

        if (ex instanceof ConnectException || (ex.getCause() != null && ex.getCause() instanceof ConnectException)) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
            errorMessage = "Downstream service is currently unavailable. Please verify microservices are running.";
            logger.error("Connection failed for path: {}. Error: {}", exchange.getRequest().getPath(), ex.getMessage());
        } else if (ex instanceof ResponseStatusException rse) {
            status = HttpStatus.valueOf(rse.getStatusCode().value());
            errorMessage = rse.getReason() != null ? rse.getReason() : ex.getMessage();
        } else if (ex.getClass().getSimpleName().contains("NotFound") || ex.getMessage() != null && ex.getMessage().contains("404")) {
            status = HttpStatus.NOT_FOUND;
            errorMessage = "The requested route was not found on API Gateway.";
        } else {
            status = HttpStatus.BAD_GATEWAY;
            errorMessage = "Gateway routing error: " + (ex.getMessage() != null ? ex.getMessage() : "Unknown error");
            logger.error("Gateway error processing request to {}: ", exchange.getRequest().getPath(), ex);
        }

        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String path = exchange.getRequest().getPath().value();
        String timestamp = LocalDateTime.now().format(ISO_FORMATTER);

        String body = String.format(
                "{\"timestamp\":\"%s\",\"status\":%d,\"error\":\"%s\",\"message\":\"%s\",\"path\":\"%s\"}",
                timestamp,
                status.value(),
                status.getReasonPhrase(),
                escapeJson(errorMessage),
                escapeJson(path)
        );

        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);

        return response.writeWith(Mono.just(buffer));
    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
}
