package com.example.milestone3.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.RequestParam;
import java.time.LocalDate;
import java.time.LocalDateTime;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {
    private final AuditLogRepo repository;

    @GetMapping
    public ResponseEntity<AuditLogPage> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String module,
            @RequestParam(defaultValue = "") String action,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        String normalizedSearch = search.toLowerCase(Locale.ROOT);
        List<AuditLog> filtered = repository.findAllByOrderByCreatedAtDesc().stream()
                .filter(log -> module.isBlank() || module.equalsIgnoreCase(log.getModule()))
                .filter(log -> action.isBlank() || action.equalsIgnoreCase(log.getAction()))
                .filter(log -> status.isBlank() || status.equalsIgnoreCase(log.getStatus()))
                .filter(log -> userId == null || userId.equals(log.getUserId()))
                .filter(log -> from == null || !log.getCreatedAt().isBefore(from.atStartOfDay()))
                .filter(log -> to == null || log.getCreatedAt().isBefore(to.plusDays(1).atStartOfDay()))
                .filter(log -> normalizedSearch.isBlank() || searchable(log).contains(normalizedSearch))
                .collect(Collectors.toList());
        int safeSize = Math.max(1, Math.min(size, 100));
        int safePage = Math.max(0, page);
        int start = Math.min(safePage * safeSize, filtered.size());
        int end = Math.min(start + safeSize, filtered.size());
        return ResponseEntity.ok(new AuditLogPage(filtered.subList(start, end), filtered.size(), safePage, safeSize));
    }

    private String searchable(AuditLog log) {
        return String.join(" ", String.valueOf(log.getUserId()), String.valueOf(log.getUsername()),
                String.valueOf(log.getActor()), String.valueOf(log.getAction()), String.valueOf(log.getModule()),
                String.valueOf(log.getStatus()), String.valueOf(log.getEntityType()), String.valueOf(log.getEntityId()),
                String.valueOf(log.getDetails())).toLowerCase(Locale.ROOT);
    }

    public record AuditLogPage(List<AuditLog> items, long total, int page, int size) { }
}
