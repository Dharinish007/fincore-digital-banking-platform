package com.example.securedigitalbankingmilestone4.auditLogging;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/auditLogging")
public class AuditController {
    @Autowired
    private AuditService auditService;

    @PostMapping("/logs")
    public AuditLog createLog(@RequestBody AuditLog auditLog){
        auditLog.setTime(LocalDateTime.now());
        return auditService.createLog(auditLog);
    }

    @GetMapping("/allLogs")
    public List<AuditLog>getAllLogs(){
        return auditService.getAllLogs();
    }

    @GetMapping("/logs/{userId}")
    public List<AuditLog>getLogByUser(@PathVariable Long userId){
        return auditService.getLogByUser(userId);
    }

    @GetMapping("/TransactionLogs/{transactionId}")
    public List<AuditLog>getLogsByTransactionId(@PathVariable Long transactionId){
        return auditService.getLogsByTransactionId(transactionId);
    }
}

