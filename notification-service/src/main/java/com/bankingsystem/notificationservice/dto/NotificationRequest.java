package com.bankingsystem.notificationservice.dto;

import com.bankingsystem.notificationservice.entity.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationRequest {

    @NotBlank
    private String recipient;

    @NotNull
    private NotificationType type;

    @NotBlank
    private String message;
}
