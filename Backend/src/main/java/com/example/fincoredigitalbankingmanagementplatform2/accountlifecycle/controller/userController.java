package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.controller;

import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO.loginDTO;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO.registerDTO;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.service.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class userController {
    @Autowired
    private userService userService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody loginDTO dto){
        return ResponseEntity.ok(userService.login(dto));
    }
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody registerDTO dto){
         userService.register(dto);
         return ResponseEntity.ok("login again");
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully"));
    }
    @GetMapping("/dashboard")
    public void dashboard(){

    }
}
