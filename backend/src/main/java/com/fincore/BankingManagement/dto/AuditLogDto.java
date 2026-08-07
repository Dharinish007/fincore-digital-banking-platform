package com.fincore.BankingManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDto {
    private String id;
    private String timestamp;
    private String action;
    private String performedBy;
    private String remarks;
    private String status;
}
