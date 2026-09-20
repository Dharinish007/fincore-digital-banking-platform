package com.bankingsystem.complianceservice.client;

import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * MOCK sanctions/watchlist screening. Real systems call an external
 * provider (OFAC, UN list, etc). These IDs are dummy test values only —
 * swap for a real API integration later if the project needs it.
 */
@Component
public class SanctionsListChecker {
    private static final Set<String> BLOCKED_GOVERNMENT_IDS = Set.of(
            "0000-0000-0000",
            "9999-9999-9999"
    );

    public boolean isSanctioned(String governmentIdNumber) {
        return governmentIdNumber != null && BLOCKED_GOVERNMENT_IDS.contains(governmentIdNumber);
    }
}
