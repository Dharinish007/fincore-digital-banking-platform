package com.fincore.BankingManagement.LoanOrigination.entity;

public enum ApplicationStatus {

    DRAFT,
    PENDING,
    UNDER_REVIEW,
    APPROVED,
    REJECTED,
    FUNDED;

    public static ApplicationStatus fromValue(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Application status is required");
        }

        String normalized = value.trim().replace('-', '_').replace(' ', '_');
        try {
            return valueOf(normalized.toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Unsupported application status: " + value, exception);
        }
    }
}