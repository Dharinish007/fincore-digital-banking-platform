package com.bankingsystem.notificationservice.dto;

import com.bankingsystem.notificationservice.entity.NotificationStatus;
import com.bankingsystem.notificationservice.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private String recipient;
    private NotificationType type;
    private String message;
    private NotificationStatus status;
    private LocalDateTime createdAt;

}
