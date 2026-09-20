package com.bankingsytem.audittrail.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditIntegrityResult {
    private boolean valid;
    private int totalRecords;
    private Long tamperedRecordId;
    private String status;
    private String details;
}
