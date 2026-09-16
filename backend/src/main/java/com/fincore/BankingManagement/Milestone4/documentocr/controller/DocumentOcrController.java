package com.fincore.BankingManagement.Milestone4.documentocr.controller;

import com.fincore.BankingManagement.Milestone4.documentocr.dto.DocumentOcrResponse;
import com.fincore.BankingManagement.Milestone4.documentocr.enums.DocumentType;
import com.fincore.BankingManagement.Milestone4.documentocr.service.DocumentOcrService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Locale;

@RestController
@RequestMapping("/api/document-ocr")
@CrossOrigin("*")
public class DocumentOcrController {

    private final DocumentOcrService documentOcrService;

    public DocumentOcrController(DocumentOcrService documentOcrService) {
        this.documentOcrService = documentOcrService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentOcrResponse> processDocument(
            @RequestParam("document") MultipartFile document,
            @RequestParam("documentType") String documentType) {

        DocumentType normalizedDocumentType;
        try {
            normalizedDocumentType = DocumentType.valueOf(
                    documentType.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Unsupported document type: " + documentType,
                    e);
        }

        DocumentOcrResponse response = documentOcrService.processDocument(document, normalizedDocumentType);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentOcrResponse> getDocumentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                documentOcrService.getDocumentById(id));
    }
}