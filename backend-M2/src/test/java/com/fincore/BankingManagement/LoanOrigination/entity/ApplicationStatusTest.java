package com.fincore.BankingManagement.LoanOrigination.entity;

import org.junit.jupiter.api.Test;

import com.fincore.BankingManagement.LoanOrigination.entity.ApplicationStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ApplicationStatusTest {

    @Test
    void acceptsFrontendStatusLabels() {
        assertEquals(ApplicationStatus.UNDER_REVIEW, ApplicationStatus.fromValue("Under Review"));
        assertEquals(ApplicationStatus.PENDING, ApplicationStatus.fromValue("pending"));
        assertEquals(ApplicationStatus.FUNDED, ApplicationStatus.fromValue("FUNDED"));
    }
}