package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.controller;

import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO.accountDTO;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO.accountDTO;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO.deleteDTO;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO.updateDTO;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.service.accountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class accountController {
    @Autowired
    private accountService accountService;
    @PostMapping("/createAccount")
    public void createAccount(@RequestBody accountDTO dto, Authentication authentication){
        String email=authentication.getName();
        accountService.createAccount(dto,email);
    }
    @DeleteMapping("/deleteAccount")
    public void deleteAccount(@RequestBody deleteDTO dto, Authentication authentication){
        accountService.deleteAccount(dto);
    }
    @PutMapping("/updateDetails")
    public void update(@RequestBody updateDTO dto){
        accountService.update(dto);

    }
    @PutMapping("/freezeAccount")
    public void freeze(@RequestParam String accountNo){
        accountService.freeze(accountNo);
    }
    @GetMapping("/totalAccount")
    public Long totalAccount(){
        return accountService.getTotalAccount();
    }
}

