package com.bankingsystem.notificationservice.config;

import com.bankingsystem.notificationservice.dto.NotificationRequest;
import com.bankingsystem.notificationservice.entity.NotificationType;
import com.bankingsystem.notificationservice.repository.NotificationRepository;
import com.bankingsystem.notificationservice.service.NotificationService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class NotificationDataInitializer implements CommandLineRunner {

    private final NotificationRepository repository;
    private final NotificationService service;

    public NotificationDataInitializer(NotificationRepository repository, NotificationService service) {
        this.repository = repository;
        this.service = service;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            NotificationRequest req1 = new NotificationRequest();
            req1.setRecipient("CUST-1001");
            req1.setType(NotificationType.KYC_APPROVED);
            req1.setMessage("Your digital KYC verification has been successfully approved.");
            service.send(req1);

            NotificationRequest req2 = new NotificationRequest();
            req2.setRecipient("CUST-1002");
            req2.setType(NotificationType.DISBURSEMENT_SUCCESS);
            req2.setMessage("Loan disbursement of INR 50,000.00 has been credited to your account.");
            service.send(req2);
        }
    }
}
