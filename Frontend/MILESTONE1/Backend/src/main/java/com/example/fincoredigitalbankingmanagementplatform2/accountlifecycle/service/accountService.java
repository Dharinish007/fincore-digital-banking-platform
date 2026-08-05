package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.service;

import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO.accountDTO;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO.deleteDTO;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO.updateDTO;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.entity.accountEntity;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.entity.userEntity;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.repo.accountRepo;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.repo.userRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class accountService {
    @Autowired
    private accountRepo accountRepo;
    @Autowired
    private userRepo userRepo;

    public void createAccount(accountDTO dto, String email) {
        accountEntity customer=new accountEntity();
        userEntity user= userRepo.findByEmail(email).orElseThrow();
        customer.setCustomerId(user);
        user.setAddress(dto.getAddress());
        user.setLastName(dto.getLastName());
        user.setFirstName(dto.getFirstName());
        customer.setOpeningDate(LocalDateTime.now());
        customer.setBalance(BigDecimal.valueOf(0));
        customer.setStatus("Active");
        user.getAccounts().add(customer);
        userRepo.save(user);
        accountRepo.save(customer);
    }

    public void deleteAccount(deleteDTO dto) {
        accountEntity customer=accountRepo.findById(dto.getCustomerId()).orElseThrow(()-> new BadCredentialsException("account not found"));
        accountRepo.delete(customer);
    }

    public void update(updateDTO dto) {
        userEntity user= userRepo.findById(dto.getCustomerId()).orElseThrow();
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getName());
        user.setAddress(dto.getAddress());
        user.setPhone(dto.getPhone());
        userRepo.save(user);
    }

    public void freeze(String accountNo) {
        accountEntity account=accountRepo.findByAccountNumber(accountNo)
                .orElseThrow(() -> new BadCredentialsException("account not found"));
        account.setStatus("Freeze");
        accountRepo.save(account);
    }

    public Long getTotalAccount() {
        return accountRepo.countByStatus("Active");
    }

}