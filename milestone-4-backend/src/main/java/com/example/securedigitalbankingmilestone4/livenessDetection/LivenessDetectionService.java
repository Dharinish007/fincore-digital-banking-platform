package com.example.securedigitalbankingmilestone4.livenessDetection;

//package com.example.securedigitalbankingmilestone4.livenessDetection;

import com.example.securedigitalbankingmilestone4.auditLogging.AuditLog;
import com.example.securedigitalbankingmilestone4.auditLogging.AuditRepo;
import nu.pattern.OpenCV;
import org.opencv.core.Mat;
import org.opencv.core.MatOfRect;
import org.opencv.core.Rect;
import org.opencv.objdetect.CascadeClassifier;
import org.opencv.videoio.VideoCapture;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class LivenessDetectionService {

    private final LivenessDetectionRepo repo;

    private final CascadeClassifier faceDetector;

    private final AuditRepo auditRepo;

    public LivenessDetectionService(LivenessDetectionRepo repo, AuditRepo auditRepo) {

        this.repo = repo;
        this.auditRepo = auditRepo;
        OpenCV.loadLocally();
        faceDetector = new CascadeClassifier(
                "src/main/resources/haarcascade_frontalface_default.xml"
        );

        if (faceDetector.empty()) {
            throw new RuntimeException(
                    "Could not load Haar Cascade XML file"
            );
        }
    }

    public LivenessVerification verify(Long userId, String challenge, MultipartFile video, String ipAddress) throws IOException {

        File tempVideo = File.createTempFile(
                "liveness_",
                ".mp4"
        );

        try {

            video.transferTo(tempVideo);

            VideoCapture capture =
                    new VideoCapture(tempVideo.getAbsolutePath());

            if (!capture.isOpened()) {
                throw new RuntimeException(
                        "Could not open uploaded video"
                );
            }

            List<Double> facePositions = new ArrayList<>();

            Mat frame = new Mat();

            int frameNumber = 0;

            // Process every 10th frame
            while (capture.read(frame)) {

                frameNumber++;

                if (frameNumber % 10 != 0) {
                    continue;
                }

                Rect face = detectFace(frame);

                if (face != null) {

                    double faceCenterX =
                            face.x + (face.width / 2.0);

                    facePositions.add(faceCenterX);
                }
            }

            capture.release();
            LivenessVerification result =
                    new LivenessVerification();

            result.setUserId(userId);
            result.setChallenge(challenge);
            result.setVerifiedAt(LocalDateTime.now());

            // Not enough frames
            if (facePositions.size() < 2) {

                result.setLive(false);
                result.setConfidenceScore(0.1);
                result.setStatus("FAILED");
                result.setAttempt((long) repo.findByUserId(userId).size());

                //create audit log
                saveEvent(result,ipAddress);
                return repo.save(result);
            }

            // Calculate movement
            double firstPosition =
                    facePositions.get(0);

            double lastPosition =
                    facePositions.get(
                            facePositions.size() - 1
                    );

            double movement =
                    lastPosition - firstPosition;

            boolean movementDetected =
                    checkChallenge(
                            challenge,
                            movement
                    );

            if (movementDetected) {

                result.setLive(true);
                result.setConfidenceScore(0.90);
                result.setStatus("VERIFIED");

            } else {

                result.setLive(false);
                result.setConfidenceScore(0.20);
                result.setStatus("FAILED");
            }
            result.setAttempt((long) repo.findByUserId(userId).size());
            //record the event in audit log
            saveEvent(result,ipAddress);
            return repo.save(result);

        } finally {

            // Delete temporary video
            if (tempVideo.exists()) {
                tempVideo.delete();
            }
        }


    }

     // Detect the first face in a frame.
    private Rect detectFace(Mat frame) {

        MatOfRect faces = new MatOfRect();

        faceDetector.detectMultiScale(
                frame,
                faces
        );

        Rect[] detectedFaces =
                faces.toArray();

        if (detectedFaces.length == 0) {
            return null;
        }

        return detectedFaces[0];
    }

    //Check whether the detected movement matches the requested challenge.
    private boolean checkChallenge(String challenge, double movement) {

        double threshold = 30.0;

        return switch (challenge.toUpperCase()) {
            case "TURN_LEFT" -> movement < -threshold;
            case "TURN_RIGHT" -> movement > threshold;
            default -> Math.abs(movement) > threshold;
        };
    }
    private AuditLog saveEvent(LivenessVerification result,String ipAddress){
        AuditLog auditLog=new AuditLog();
        auditLog.setIpAddress(ipAddress);
        auditLog.setUserId(result.getUserId());
        auditLog.setResourceId(String.valueOf(result.getVerificationId()));
        auditLog.setAction("Liveness Verification");
        auditLog.setTime(LocalDateTime.now());
        auditLog.setDescription("Liveness Verification status:"+result.getStatus()+" Challenge :"+result.getChallenge());
        auditLog.setResourceType("Verification");
        return auditRepo.save(auditLog);
    }
}