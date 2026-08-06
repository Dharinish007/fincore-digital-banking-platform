package com.fincore.BankingManagement.Exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalHandleException {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String,Object>>handleException(RuntimeException e){
        Map<String,Object>error=new HashMap<>();
        error.put("status",HttpStatus.BAD_REQUEST.value());
        error.put("message",e.getMessage());
        error.put("timestamp", LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
