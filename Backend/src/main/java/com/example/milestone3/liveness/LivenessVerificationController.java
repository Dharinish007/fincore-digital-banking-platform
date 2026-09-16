package com.example.milestone3.liveness;

import com.example.milestone3.audit.AuditLogService;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.milestone3.operations.repo.CustomerRepo;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import org.springframework.http.HttpStatus;

import com.example.milestone3.notificationService.service.NotificationService;
import com.example.milestone3.operations.entity.Account;
import com.example.milestone3.operations.repo.AccountRepo;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/liveness")
@RequiredArgsConstructor
public class LivenessVerificationController {
    private final LivenessVerificationRepo repository;
    private final CustomerRepo customerRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private final AccountRepo accountRepo;

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getCustomerVerifications(@PathVariable Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found", "message", "User with Customer ID #" + customerId + " not found in database."));
        }
        return ResponseEntity.ok(repository.findByCustomerIdOrderByCreatedAtDesc(customerId));
    }

    @PostMapping("/start")
    public ResponseEntity<?> start(@Valid @RequestBody StartLivenessRequest request,
                                   HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        if (!customerRepository.existsById(request.customerId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found", "message", "User with Customer ID #" + request.customerId() + " not found in database."));
        }
        LivenessVerification verification = new LivenessVerification(
            null, request.customerId(), "VER-" + UUID.randomUUID(), "PENDING", null,
                    "LIVENESS_CHECK", clientIp, null, null, LocalDateTime.now());
        LivenessVerification saved = repository.save(verification);
        auditLogService.record("CUSTOMER", "LIVENESS_STARTED", "LIVENESS_VERIFICATION",
            saved.getId().toString(), "Verification session started", clientIp);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@Valid @RequestBody LivenessRequest request,
                                    HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        if (!customerRepository.existsById(request.customerId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found", "message", "User with Customer ID #" + request.customerId() + " not found in database."));
        }
        boolean passed = request.confidenceScore().compareTo(new BigDecimal("80")) >= 0;
        LivenessVerification verification = request.verificationId() == null
            ? new LivenessVerification(null, request.customerId(), "VER-" + UUID.randomUUID(),
            passed ? "VERIFIED" : "FAILED", request.confidenceScore(), "LIVENESS_CHECK", clientIp,
            passed ? null : "Liveness confidence is below the verification threshold",
            passed ? LocalDateTime.now() : null, LocalDateTime.now())
            : repository.findById(request.verificationId())
            .filter(item -> item.getCustomerId().equals(request.customerId()))
            .orElseThrow();
        verification.setStatus(passed ? "VERIFIED" : "FAILED");
        verification.setConfidenceScore(request.confidenceScore());
        verification.setVerificationMethod("LIVENESS_CHECK");
        verification.setIpAddress(clientIp);
        verification.setFailureReason(passed ? null : "Liveness confidence is below the verification threshold");
        verification.setVerifiedAt(passed ? LocalDateTime.now() : null);
        LivenessVerification saved = repository.save(verification);

        if (passed) {
            // Activate any pending accounts
            List<Account> customerAccounts = accountRepo.findByCustomerId(request.customerId());
            for (Account acc : customerAccounts) {
                if ("PENDING_VERIFICATION".equalsIgnoreCase(acc.getStatus()) || "PENDING".equalsIgnoreCase(acc.getStatus())) {
                    acc.setStatus("ACTIVE");
                    accountRepo.save(acc);
                }
            }

            notificationService.notifyCustomer(
                    request.customerId(),
                    "Biometric Liveness Verified",
                    "Success! Biometric liveness check passed (" + request.confidenceScore() + "% confidence). Your accounts are now fully active."
            );
        } else {
            notificationService.notifyCustomer(
                    request.customerId(),
                    "Liveness Verification Failed",
                    "Security Notice: Biometric liveness verification fell below threshold (" + request.confidenceScore() + "%). Please retry."
            );
        }

        auditLogService.record(
                "CUSTOMER",
                passed ? "LIVENESS_VERIFICATION_PASSED" : "LIVENESS_VERIFICATION_FAILED",
                "LIVENESS_VERIFICATION",
                saved.getId().toString(),
                "Customer " + request.customerId() + ", confidence " + request.confidenceScore(),
                clientIp
        );
        return ResponseEntity.ok(saved);
    }

    public record LivenessRequest(
            @NotNull Long customerId,
            Long verificationId,
            @NotNull @DecimalMin("0.0") @DecimalMax("100.0") BigDecimal confidenceScore,
            String verificationMethod,
            String ipAddress
    ) {
        public LivenessRequest {
            verificationMethod = "LIVENESS_CHECK";
        }
    }

    public record StartLivenessRequest(@NotNull Long customerId, String verificationMethod, String ipAddress) {
        public StartLivenessRequest {
            verificationMethod = "LIVENESS_CHECK";
        }
    }
}
