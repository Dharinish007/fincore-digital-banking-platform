package com.example.milestone3.notificationService.service;

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

    public void sendEmail(NotificationRequest request) {
        NotificationEntity notification=new NotificationEntity();
        notification.setMessage(request.getMessage());
        notification.setRecipient(request.getTo());
        notification.setType("EMAIL");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setStatus("PENDING");
        try {
            emailService.sendEmail(request);
            notification.setStatus("SENT");
        } catch (Exception e) {
            System.out.println("Email sending failed!");
            System.out.println("Error: " + e.getMessage());

            e.printStackTrace();
            notification.setStatus("FAILED");
        }
        notificationRepo.save(notification);
    }

    public List<NotificationEntity> getHistory(String recipient) {
        return notificationRepo.findByRecipientOrderByCreatedAtDesc(recipient);
    }
}
