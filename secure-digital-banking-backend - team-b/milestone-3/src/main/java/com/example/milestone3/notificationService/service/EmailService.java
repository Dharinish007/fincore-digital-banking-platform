package com.example.milestone3.notificationService.service;

import com.example.milestone3.notificationService.DTO.NotificationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(NotificationRequest request) {
        SimpleMailMessage mailMessage=new SimpleMailMessage();
        mailMessage.setTo(request.getTo());
        mailMessage.setSubject(request.getSubject());
        mailMessage.setText(request.getMessage());
        mailSender.send(mailMessage);
    }
}
