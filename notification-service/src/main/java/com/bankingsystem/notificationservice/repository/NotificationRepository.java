package com.bankingsystem.notificationservice.repository;

import com.bankingsystem.notificationservice.entity.Notification;
import com.bankingsystem.notificationservice.entity.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientOrderByCreatedAtDesc(String recipient);

    List<Notification> findByRecipientAndStatusOrderByCreatedAtDesc(String recipient, NotificationStatus status);

    long countByRecipientAndStatus(String recipient, NotificationStatus status);
}
