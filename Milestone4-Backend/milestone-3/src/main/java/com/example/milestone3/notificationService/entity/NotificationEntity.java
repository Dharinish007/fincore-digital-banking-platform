package com.example.milestone3.notificationService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
//import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "notifications")
public class NotificationEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(name = "recipient", nullable = false)
        private String recipient;

        @Column(name = "type")
        private String type;

        @Column(name = "message", length = 1000)
        private String message;

        @Column(name = "status")
        private String status;

        @Column(name = "created_at", nullable = false)
        private LocalDateTime createdAt;

}
