package com.fincore.BankingManagement.service;

import com.fincore.BankingManagement.dto.AuditLogDto;

import java.util.List;

public interface AuditLogService {
    List<AuditLogDto> getLogsForAccount(String accountNo);
}
