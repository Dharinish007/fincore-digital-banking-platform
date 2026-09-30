package com.fincore.controller;

import com.fincore.dto.ApiResponse;
import com.fincore.entity.NpaRecord;
import com.fincore.service.NpaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/milestone2/npa")
@CrossOrigin(origins = "*")
public class NpaController {

    @Autowired
    private NpaService npaService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NpaRecord>>> getAllNpaRecords() {
        return ResponseEntity.ok(ApiResponse.ok("NPA records retrieved", npaService.getAllNpaRecords()));
    }

    @PostMapping("/evaluate")
    public ResponseEntity<ApiResponse<List<NpaRecord>>> triggerNpaEvaluation() {
        List<NpaRecord> list = npaService.evaluateAllLoansNpa();
        return ResponseEntity.ok(ApiResponse.ok("Automated NPA asset classification evaluated", list));
    }
}
