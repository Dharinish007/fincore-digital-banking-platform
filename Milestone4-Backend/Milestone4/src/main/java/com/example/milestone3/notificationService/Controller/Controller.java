package com.example.milestone3.notificationService.Controller;

import com.example.milestone3.notificationService.DTO.NotificationRequest;
import com.example.milestone3.notificationService.entity.NotificationEntity;
import com.example.milestone3.notificationService.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/notification")
public class Controller {
    @Autowired
    private NotificationService notificationService;
    @PostMapping("/email")
    public String emailNotification(@RequestBody NotificationRequest requestDto){
        notificationService.sendEmail(requestDto);
        return "Notification sent successfully";
    }
    @GetMapping("/history")
    public List<NotificationEntity>history(@RequestParam String recipient){
        return notificationService.getHistory(recipient);
    }
}
