package com.example.securedigitalbankingmilestone4.livenessDetection;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
@RestController
@RequestMapping("/api/livenessDetection")
public class LivenessDetectionController {
    @Autowired
    private LivenessDetectionService service;
    @PostMapping("/verify")
    public ResponseEntity<LivenessVerification> verifyLiveness(
            @RequestParam Long userId,
            @RequestParam String challenge,
            @RequestParam("video") MultipartFile video,
            HttpServletRequest request)
            throws IOException {
        String ipAddress= request.getLocalAddr();
        LivenessVerification result =
                service.verify(userId, challenge, video, ipAddress);

        return ResponseEntity.ok(result);
    }
}
