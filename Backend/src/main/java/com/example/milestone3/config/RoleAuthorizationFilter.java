package com.example.milestone3.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(1)
public class RoleAuthorizationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Allow CORS pre-flight, Auth APIs, Health check, static/error endpoints
        if ("OPTIONS".equalsIgnoreCase(method)
                || path.startsWith("/api/auth")
                || path.startsWith("/api/health")
                || path.startsWith("/error")) {
            filterChain.doFilter(request, response);
            return;
        }

        String userRole = request.getHeader("X-User-Role");
        if (userRole == null || userRole.isBlank()) {
            userRole = "ADMIN"; // Default fallback if no header passed
        } else {
            userRole = userRole.trim().toUpperCase();
        }

        // Normalize role aliases
        if ("BANK STAFF".equals(userRole) || "STAFF".equals(userRole)) {
            userRole = "BANK_STAFF";
        } else if ("LOAN OFFICER".equals(userRole)) {
            userRole = "LOAN_OFFICER";
        } else if ("FRAUD OFFICER".equals(userRole)) {
            userRole = "FRAUD_OFFICER";
        }

        // 1. AUDITOR: Strictly Read-Only Enforcement
        if ("AUDITOR".equals(userRole)) {
            if (!"GET".equalsIgnoreCase(method)) {
                sendForbiddenError(response, "AUDITOR_READ_ONLY", "Auditor role has strictly read-only access. Modification operations are forbidden.");
                return;
            }
        }

        // 2. CUSTOMER: Restrictions on administrative & approval APIs
        if ("CUSTOMER".equals(userRole)) {
            if (path.contains("/disbursements") && ("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method))) {
                sendForbiddenError(response, "CUSTOMER_ACTION_NOT_ALLOWED", "Customers are not authorized to disburse loans.");
                return;
            }
            if (path.contains("/loans") && (path.contains("/approve") || path.contains("/reject"))) {
                sendForbiddenError(response, "CUSTOMER_ACTION_NOT_ALLOWED", "Customers are not authorized to approve or reject loans.");
                return;
            }
            if (path.startsWith("/api/settlements") && ("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method))) {
                sendForbiddenError(response, "CUSTOMER_ACTION_NOT_ALLOWED", "Customers are not authorized to trigger manual settlements.");
                return;
            }
            if (path.startsWith("/api/fraud/decision") || path.startsWith("/api/fraud/review")) {
                sendForbiddenError(response, "CUSTOMER_ACTION_NOT_ALLOWED", "Customers cannot alter fraud investigation decisions.");
                return;
            }
        }

        // 3. LOAN_OFFICER: Cannot modify fraud cases
        if ("LOAN_OFFICER".equals(userRole)) {
            if (path.startsWith("/api/fraud/decision") || path.startsWith("/api/fraud/review")) {
                sendForbiddenError(response, "LOAN_OFFICER_RESTRICTION", "Loan Officers cannot modify fraud decisions.");
                return;
            }
        }

        // 4. FRAUD_OFFICER: Cannot disburse or approve loans
        if ("FRAUD_OFFICER".equals(userRole)) {
            if (path.contains("/loans") && (path.contains("/approve") || path.contains("/reject"))) {
                sendForbiddenError(response, "FRAUD_OFFICER_RESTRICTION", "Fraud Officers cannot approve or reject loan applications.");
                return;
            }
            if (path.contains("/disbursements") && ("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method))) {
                sendForbiddenError(response, "FRAUD_OFFICER_RESTRICTION", "Fraud Officers cannot disburse loans.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private void sendForbiddenError(HttpServletResponse response, String errorKey, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write(String.format("{\"error\": \"%s\", \"message\": \"%s\", \"status\": 403}", errorKey, message));
    }
}
