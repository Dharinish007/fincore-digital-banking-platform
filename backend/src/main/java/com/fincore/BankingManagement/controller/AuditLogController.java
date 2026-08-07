package com.fincore.BankingManagement.controller;

import com.fincore.BankingManagement.dto.AuditLogDto;
import com.fincore.BankingManagement.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping("/{accountNo}")
    public ResponseEntity<List<AuditLogDto>> getLogsForAccount(@PathVariable String accountNo) {
        return ResponseEntity.ok(auditLogService.getLogsForAccount(accountNo));
    }
}
