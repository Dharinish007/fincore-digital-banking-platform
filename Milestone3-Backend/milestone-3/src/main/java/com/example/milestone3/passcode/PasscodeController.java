package com.example.milestone3.passcode;

import com.example.milestone3.audit.AuditLogService;
import com.example.milestone3.liveness.LivenessVerification;
import com.example.milestone3.liveness.LivenessVerificationRepo;
import com.example.milestone3.operations.entity.Customer;
import com.example.milestone3.operations.repo.CustomerRepo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.math.BigDecimal;
import java.util.UUID;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/passcode")
@RequiredArgsConstructor
public class PasscodeController {
    private final AuditLogService auditLogService;
    private final LivenessVerificationRepo livenessRepository;
    private final CustomerRepo customerRepository;

    private static final DateTimeFormatter DOB_FORMAT = DateTimeFormatter.ofPattern("ddMMyyyy");

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(@Valid @RequestBody PasscodeRequest request,
                                                      HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        LocalDateTime now = LocalDateTime.now();
        Customer customer = customerRepository.findById(request.customerId()).orElse(null);
        boolean matchesDateOfBirth = customer != null
                && customer.getDateOfBirth() != null
                && customer.getDateOfBirth().format(DOB_FORMAT).equals(request.passcode());
        if (matchesDateOfBirth) {
            LivenessVerification saved = saveLivenessResult(request, "VERIFIED", null, now, clientIp);
            recordAudit("PASSCODE_VERIFICATION_SUCCESS", request, clientIp);
            return ResponseEntity.ok(result(true, "Date of birth verified.", saved));
        }
        LivenessVerification saved = saveLivenessResult(request, "FAILED", "Date of birth did not match.", now, clientIp);
        recordAudit("PASSCODE_VERIFICATION_FAILED", request, clientIp);
        return ResponseEntity.ok(result(false, "Date of birth did not match.", saved));
    }

    private LivenessVerification saveLivenessResult(PasscodeRequest request, String status, String reason,
                                                    LocalDateTime timestamp, String clientIp) {
        if (request.verificationId() != null) {
            LivenessVerification existing = livenessRepository.findById(request.verificationId())
                .filter(item -> item.getCustomerId().equals(request.customerId()))
                .orElse(null);
            if (existing != null) {
            existing.setStatus(status);
            existing.setVerificationMethod("LIVENESS_CHECK");
            existing.setFailureReason(reason);
            existing.setVerifiedAt(status.equals("VERIFIED") ? timestamp : null);
            return livenessRepository.save(existing);
            }
        }
        return livenessRepository.save(new LivenessVerification(null, request.customerId(), "VER-" + UUID.randomUUID(),
            status, BigDecimal.ZERO, "LIVENESS_CHECK", clientIp, reason,
                status.equals("VERIFIED") ? timestamp : null, timestamp));
    }

    private Map<String, Object> result(boolean verified, String message, LivenessVerification liveness) {
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("verified", verified);
        response.put("message", message);
        if (liveness != null) {
            response.put("verificationId", liveness.getId());
            response.put("verificationStatus", liveness.getStatus());
            response.put("verificationMethod", liveness.getVerificationMethod());
            response.put("verifiedAt", liveness.getVerifiedAt());
        }
        return response;
    }

    private void recordAudit(String action, PasscodeRequest request, String clientIp) {
        auditLogService.record("SECURITY_MODULE", action, "SECURITY", request.customerId().toString(), "Passcode verification event", clientIp);
    }

    public record PasscodeRequest(@NotNull Long customerId, Long verificationId,
                                  @NotBlank @Pattern(regexp = "\\d{8}") String passcode, String ipAddress) { }
}
