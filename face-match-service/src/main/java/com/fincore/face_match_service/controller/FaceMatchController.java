package com.fincore.face_match_service.controller;
import com.fincore.face_match_service.dto.FaceMatchRequest;
import com.fincore.face_match_service.dto.FaceMatchResponse;
import com.fincore.face_match_service.service.FaceMatchService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/face-match")
public class FaceMatchController {

    private final FaceMatchService faceMatchService;

    public FaceMatchController(
            FaceMatchService faceMatchService) {

        this.faceMatchService = faceMatchService;
    }

    @PostMapping
    public ResponseEntity<FaceMatchResponse> performFaceMatch(
            @Valid @ModelAttribute FaceMatchRequest request) {

        FaceMatchResponse response =
                faceMatchService.performFaceMatch(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{verificationId}")
    public ResponseEntity<FaceMatchResponse> getVerification(
            @PathVariable String verificationId) {

        return ResponseEntity.ok(
                faceMatchService.getVerification(
                        verificationId
                )
        );
    }
}