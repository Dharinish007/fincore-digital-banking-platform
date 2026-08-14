package com.fincore.loanservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  // Loan not found
  @ExceptionHandler(LoanNotFoundException.class)
  public ResponseEntity<Map<String, Object>> handleLoanNotFound(
    LoanNotFoundException ex) {

    Map<String, Object> response = new HashMap<>();

    response.put("status", 404);
    response.put("error", "Not Found");
    response.put("message", ex.getMessage());

    return new ResponseEntity<>(
      response,
      HttpStatus.NOT_FOUND
    );
  }

  // Validation errors
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(
    MethodArgumentNotValidException ex) {

    Map<String, Object> response = new HashMap<>();

    response.put("status", 400);
    response.put("error", "Bad Request");

    Map<String, String> errors = new HashMap<>();

    ex.getBindingResult()
      .getFieldErrors()
      .forEach(error ->
        errors.put(
          error.getField(),
          error.getDefaultMessage()
        )
      );

    response.put("messages", errors);

    return new ResponseEntity<>(
      response,
      HttpStatus.BAD_REQUEST
    );
  }
}
