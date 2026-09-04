package com.digitalBanking.FaceMatching.controller;
import com.digitalBanking.FaceMatching.dto.FaceMatchResponse;
import com.digitalBanking.FaceMatching.service.FaceMatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/face")
@CrossOrigin("*")
public class FaceMatchController {

    private final FaceMatchService faceMatchService;

    public FaceMatchController(FaceMatchService faceMatchService) {
        this.faceMatchService = faceMatchService;
    }

    @GetMapping("/test")
    public String test() {
        return "Face Match Service is Working!";
    }

    @PostMapping("/verify")
    public ResponseEntity<FaceMatchResponse> verifyFace(

            @RequestParam("registeredImage")
            MultipartFile registeredImage,

            @RequestParam("selfieImage")
            MultipartFile selfieImage
    ) {

        FaceMatchResponse response =
                faceMatchService.verifyFace(
                        registeredImage,
                        selfieImage
                );

        return ResponseEntity.ok(response);
    }
}