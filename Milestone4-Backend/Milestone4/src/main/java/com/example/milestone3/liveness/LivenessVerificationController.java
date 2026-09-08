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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/liveness")
@RequiredArgsConstructor
public class LivenessVerificationController {
    private final LivenessVerificationRepo repository;
    private final AuditLogService auditLogService;

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<LivenessVerification>> getCustomerVerifications(@PathVariable Long customerId) {
        return ResponseEntity.ok(repository.findByCustomerIdOrderByCreatedAtDesc(customerId));
    }

        @PostMapping("/start")
        public ResponseEntity<LivenessVerification> start(@Valid @RequestBody StartLivenessRequest request,
                                                          HttpServletRequest httpRequest) {
            String clientIp = httpRequest.getRemoteAddr();
        LivenessVerification verification = new LivenessVerification(
            null, request.customerId(), "VER-" + UUID.randomUUID(), "PENDING", null,
                    "LIVENESS_CHECK", clientIp, null, null, LocalDateTime.now());
        LivenessVerification saved = repository.save(verification);
        auditLogService.record("CUSTOMER", "LIVENESS_STARTED", "LIVENESS_VERIFICATION",
            saved.getId().toString(), "Verification session started", clientIp);
        return ResponseEntity.ok(saved);
        }

    @PostMapping("/verify")
    public ResponseEntity<LivenessVerification> verify(@Valid @RequestBody LivenessRequest request,
                                                       HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
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
