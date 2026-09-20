package com.example.milestone3.notificationService.Controller;

import com.example.milestone3.notificationService.DTO.NotificationRequest;
import com.example.milestone3.notificationService.entity.NotificationEntity;
import com.example.milestone3.notificationService.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/notification")
public class Controller {
    @Autowired
    private NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<NotificationEntity> sendNotification(@RequestBody NotificationRequest requestDto) {
        NotificationEntity saved = notificationService.sendNotification(requestDto);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/email")
    public ResponseEntity<NotificationEntity> emailNotification(@RequestBody NotificationRequest requestDto) {
        if (requestDto.getType() == null) {
            requestDto.setType("EMAIL");
        }
        NotificationEntity saved = notificationService.sendNotification(requestDto);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<NotificationEntity> listAll() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/all")
    public List<NotificationEntity> allNotifications() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/history")
    public List<NotificationEntity> history(@RequestParam(required = false) String recipient) {
        return notificationService.getHistory(recipient);
    }

    @GetMapping("/customer/{customerId}")
    public List<NotificationEntity> customerNotifications(@PathVariable Long customerId) {
        return notificationService.getAllNotifications();
    }
}
