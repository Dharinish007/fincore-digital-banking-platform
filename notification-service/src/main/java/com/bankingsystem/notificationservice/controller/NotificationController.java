package com.bankingsystem.notificationservice.controller;

import com.bankingsystem.notificationservice.dto.NotificationRequest;
import com.bankingsystem.notificationservice.dto.NotificationResponse;
import com.bankingsystem.notificationservice.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<NotificationResponse> send(@Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.send(request));
    }

    @GetMapping
    public List<NotificationResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/recipient/{recipient}")
    public List<NotificationResponse> getByRecipient(@PathVariable String recipient) {
        return service.getByRecipient(recipient);
    }

    @GetMapping("/recipient/{recipient}/unread")
    public List<NotificationResponse> getUnread(@PathVariable String recipient) {
        return service.getUnreadByRecipient(recipient);
    }

    @GetMapping("/recipient/{recipient}/unread-count")
    public Map<String, Long> getUnreadCount(@PathVariable String recipient) {
        return Map.of("count", service.getUnreadCount(recipient));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(service.markAsRead(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
