package com.example.milestone3.notificationService.service;

import com.example.milestone3.audit.AuditLogService;
import com.example.milestone3.notificationService.DTO.NotificationRequest;
import com.example.milestone3.notificationService.entity.NotificationEntity;
import com.example.milestone3.notificationService.repo.NotificationRepo;
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

    public NotificationEntity sendNotification(NotificationRequest request) {
        String type = (request.getType() != null && !request.getType().trim().isEmpty())
                ? request.getType().trim().toUpperCase()
                : "EMAIL";

        NotificationEntity notification = new NotificationEntity();
        notification.setType(type);
        notification.setRecipient(request.getTo());
        String subject = (request.getSubject() != null && !request.getSubject().trim().isEmpty())
                ? request.getSubject().trim()
                : type + " Notification Alert";
        notification.setSubject(subject);
        notification.setEventType(subject);
        notification.setMessage(request.getMessage());
        notification.setCreatedAt(LocalDateTime.now());
        notification.setStatus("DELIVERED");

        if ("EMAIL".equalsIgnoreCase(type)) {
            try {
                emailService.sendEmail(request);
                notification.setStatus("DELIVERED");
            } catch (Exception e) {
                System.out.println("Notice: SMTP relay connection: " + e.getMessage() + ". Notification stored in DB.");
                notification.setStatus("SENT");
            }
        } else if ("SMS".equalsIgnoreCase(type)) {
            System.out.println("FinCore SMS Gateway -> Dispatch to " + request.getTo() + ": " + request.getMessage());
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
                request.getTo(),
                (notification.getSubject() != null ? notification.getSubject() + ": " : "") + notification.getMessage(),
                saved.getStatus(),
                null
        );

        return saved;
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
