package com.digitalBanking.liveness.controller;

import com.digitalBanking.liveness.dto.LivenessResponse;
import com.digitalBanking.liveness.service.LivenessService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/kyc/liveness")
@CrossOrigin(
        origins = "http://localhost:4200",
        methods = {
                RequestMethod.POST,
                RequestMethod.OPTIONS
        }
)
public class LivenessController {

    private final LivenessService livenessService;

    public LivenessController(
            LivenessService livenessService
    ) {
        this.livenessService = livenessService;
    }

    @PostMapping(
            value = "/verify",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<LivenessResponse> verifyLiveness(
            @RequestParam("image") MultipartFile image
    ) {

        try {

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "LIVENESS REQUEST FROM ANGULAR"
            );

            System.out.println(
                    "File: " + image.getOriginalFilename()
            );

            System.out.println(
                    "Size: " + image.getSize()
            );

            System.out.println(
                    "======================================"
            );

            LivenessResponse response =
                    livenessService.verifyLiveness(image);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            e.printStackTrace();

            return ResponseEntity.badRequest().build();

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }
}