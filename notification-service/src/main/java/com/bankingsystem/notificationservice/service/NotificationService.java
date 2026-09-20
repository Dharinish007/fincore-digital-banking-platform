package com.bankingsystem.notificationservice.service;

import com.bankingsystem.notificationservice.dto.NotificationRequest;
import com.bankingsystem.notificationservice.dto.NotificationResponse;
import com.bankingsystem.notificationservice.entity.Notification;
import com.bankingsystem.notificationservice.entity.NotificationStatus;
import com.bankingsystem.notificationservice.exception.NotificationNotFoundException;
import com.bankingsystem.notificationservice.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public NotificationResponse send(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setRecipient(request.getRecipient());
        notification.setType(request.getType());
        notification.setMessage(request.getMessage());

        Notification saved = repository.save(notification);
        return toResponse(saved);
    }

    public List<NotificationResponse> getAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public List<NotificationResponse> getByRecipient(String recipient) {
        return repository.findByRecipientOrderByCreatedAtDesc(recipient)
                .stream().map(this::toResponse).toList();
    }

    public List<NotificationResponse> getUnreadByRecipient(String recipient) {
        return repository.findByRecipientAndStatusOrderByCreatedAtDesc(recipient, NotificationStatus.SENT)
                .stream().map(this::toResponse).toList();
    }

    public long getUnreadCount(String recipient) {
        return repository.countByRecipientAndStatus(recipient, NotificationStatus.SENT);
    }

    public NotificationResponse markAsRead(Long id) {
        Notification notification = repository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found: " + id));
        notification.setStatus(NotificationStatus.READ);
        return toResponse(repository.save(notification));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NotificationNotFoundException("Notification not found: " + id);
        }
        repository.deleteById(id);
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(), n.getRecipient(), n.getType(), n.getMessage(), n.getStatus(), n.getCreatedAt()
        );
    }
}
