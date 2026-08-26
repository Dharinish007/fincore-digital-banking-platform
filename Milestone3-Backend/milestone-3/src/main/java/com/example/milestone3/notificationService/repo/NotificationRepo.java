package com.example.milestone3.notificationService.repo;

import com.example.milestone3.notificationService.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepo extends JpaRepository<NotificationEntity,Long> {
    List<NotificationEntity> findByRecipientOrderByCreatedAtDesc(
            String recipient
    );
}
