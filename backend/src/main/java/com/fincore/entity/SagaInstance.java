package com.fincore.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saga_instances")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SagaInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "saga_id", nullable = false, unique = true, length = 100)
    private String sagaId;

    @Column(name = "saga_type", nullable = false, length = 100)
    private String sagaType;

    @Column(name = "current_step", nullable = false, length = 100)
    private String currentStep;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private SagaStatus status = SagaStatus.STARTED;

    @Column(name = "payload_json", columnDefinition = "TEXT")
    private String payloadJson;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "retry_count")
    @Builder.Default
    private Integer retryCount = 0;

    @Column(name = "started_at", updatable = false)
    @Builder.Default
    private LocalDateTime startedAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public enum SagaStatus {
        STARTED, IN_PROGRESS, COMPLETED, FAILED, COMPENSATING, COMPENSATED
    }
}
