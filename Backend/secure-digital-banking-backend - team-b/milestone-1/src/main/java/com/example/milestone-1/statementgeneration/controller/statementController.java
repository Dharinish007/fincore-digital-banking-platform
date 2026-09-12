package com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.controller;

import com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.DTO.statementRequestDTO;
import com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.DTO.statementResponseDTO;
import com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.entity.transactionEntity;
import com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.service.statementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;
@CrossOrigin(origins = "http://localhost:4200/")
@RestController
public class statementController {
    @Autowired
    //Statement Service
    private statementService statementService;
    @GetMapping("/viewStatement")
    public List<statementResponseDTO> viewStatement(@RequestBody statementRequestDTO dto, Authentication authentication){
        System.out.println("api hit");
        String email= authentication.getName();
        return statementService.getStatement(email,dto);
    }
    @GetMapping("/downloadStatement")
    public ResponseEntity<Resource>download(@RequestBody statementRequestDTO dto, Authentication authentication){
        String email= authentication.getName();
        ByteArrayInputStream inputStream= statementService.downloadPDF(email,dto);
        //convert it in resource form
        InputStreamResource resource=new InputStreamResource(inputStream);

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=statement"+ LocalDate.now() +".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}
