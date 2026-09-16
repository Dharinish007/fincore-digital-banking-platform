package com.example.milestone3.notificationService.service;

import com.example.milestone3.audit.AuditLogService;
import com.example.milestone3.notificationService.DTO.NotificationRequest;
import com.example.milestone3.notificationService.entity.NotificationEntity;
import com.example.milestone3.notificationService.repo.NotificationRepo;
import com.example.milestone3.operations.entity.Customer;
import com.example.milestone3.operations.repo.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepo notificationRepo;
    @Autowired
    private EmailService emailService;
    @Autowired
    private AuditLogService auditLogService;
    @Autowired
    private CustomerRepo customerRepo;

    public NotificationEntity sendNotification(NotificationRequest request) {
        String type = (request.getType() != null && !request.getType().trim().isEmpty())
                ? request.getType().trim().toUpperCase()
                : "EMAIL";

        NotificationEntity notification = new NotificationEntity();
        notification.setType(type);
        notification.setRecipient(request.getTo() != null ? request.getTo() : "client@fincore.com");
        String subject = (request.getSubject() != null && !request.getSubject().trim().isEmpty())
                ? request.getSubject().trim()
                : type + " Banking Notification Alert";
        notification.setSubject(subject);
        notification.setEventType(subject);
        notification.setMessage(request.getMessage() != null ? request.getMessage() : "Notification message");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setStatus("DELIVERED");

        if ("EMAIL".equalsIgnoreCase(type)) {
            try {
                emailService.sendEmail(request);
                notification.setStatus("DELIVERED");
            } catch (Exception e) {
                notification.setStatus("SENT");
            }
        } else if ("SMS".equalsIgnoreCase(type)) {
            notification.setStatus("DELIVERED");
        } else {
            notification.setStatus("DELIVERED");
        }

        NotificationEntity saved = notificationRepo.save(notification);

        auditLogService.record(
                null,
                "NOTIFICATION_SERVICE",
                "NOTIFICATION_DISPATCHED",
                "NOTIFICATIONS",
                type,
                saved.getRecipient(),
                (notification.getSubject() != null ? notification.getSubject() + ": " : "") + notification.getMessage(),
                saved.getStatus(),
                null
        );

        return saved;
    }

    public NotificationEntity notifyCustomer(Long customerId, String subject, String message) {
        String recipient = "client" + customerId + "@fincore.com";
        String channel = "SMS";
        if (customerId != null) {
            Customer c = customerRepo.findById(customerId).orElse(null);
            if (c != null) {
                recipient = c.getPhoneNumber() != null && !c.getPhoneNumber().isBlank() ? c.getPhoneNumber() : c.getEmail();
                channel = c.getPhoneNumber() != null && !c.getPhoneNumber().isBlank() ? "SMS" : "EMAIL";
            }
        }
        return sendNotification(new NotificationRequest(recipient, channel, subject, message));
    }

    public void sendEmail(NotificationRequest request) {
        if (request.getType() == null) {
            request.setType("EMAIL");
        }
        sendNotification(request);
    }

    public List<NotificationEntity> getAllNotifications() {
        return notificationRepo.findAllByOrderByCreatedAtDesc();
    }

    public List<NotificationEntity> getHistory(String recipient) {
        if (recipient == null || recipient.trim().isEmpty() || "ALL".equalsIgnoreCase(recipient.trim())) {
            return getAllNotifications();
        }
        return notificationRepo.findByRecipientOrderByCreatedAtDesc(recipient.trim());
    }
}
