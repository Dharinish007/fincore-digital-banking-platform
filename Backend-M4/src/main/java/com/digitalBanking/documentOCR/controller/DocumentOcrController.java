package com.digitalBanking.documentOCR.controller;

import com.digitalBanking.documentOCR.dto.DocumentOcrRequest;
import com.digitalBanking.documentOCR.dto.DocumentOcrResponse;
import com.digitalBanking.documentOCR.service.DocumentOcrService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/document-ocr")
@CrossOrigin(origins = "http://localhost:4200")
public class DocumentOcrController {

    private final DocumentOcrService documentOcrService;

    public DocumentOcrController(DocumentOcrService documentOcrService) {
        this.documentOcrService = documentOcrService;
    }

    @PostMapping
    public ResponseEntity<DocumentOcrResponse> processDocument(
            @RequestBody DocumentOcrRequest request) {

        DocumentOcrResponse response =
                documentOcrService.processDocument(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentOcrResponse> getDocumentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                documentOcrService.getDocumentById(id)
        );
    }
}