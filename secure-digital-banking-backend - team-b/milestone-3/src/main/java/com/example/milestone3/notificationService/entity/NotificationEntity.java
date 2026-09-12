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

        private String recipient;

        private String type;

        @Column(length = 1000)
        private String message;

        private String status;

        private LocalDateTime createdAt;

}
