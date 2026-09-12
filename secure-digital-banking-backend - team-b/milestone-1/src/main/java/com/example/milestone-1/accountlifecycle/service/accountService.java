package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.service;

import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO.accountDTO;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO.accountResponse;
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
import java.util.List;

@Service
public class accountService {
    @Autowired
    private accountRepo accountRepo;
    @Autowired
    private userRepo userRepo;

    public void createAccount(accountDTO dto, String email) {
        accountEntity account=new accountEntity();
        userEntity user= userRepo.findByEmail(email).orElseThrow();
        //create the account
        account.setCustomerId(user);
        account.setOpeningDate(LocalDateTime.now());
        account.setBalance(BigDecimal.valueOf(0));
        account.setStatus("Active");
        account.setAccountType(dto.getType());
        account.setAvailableBalance(BigDecimal.valueOf(0));
        accountRepo.save(account);
        account.setAccountNumber("ACC"+(1000+account.getAccountId()));
        accountRepo.save(account);
        //save the rest of the user details
        user.setAddress(dto.getAddress());
        user.setLastName(dto.getLastName());
        user.setFirstName(dto.getFirstName());
        user.getAccounts().add(account);
        userRepo.save(user);
    }

    public void deleteAccount(deleteDTO dto) {
        accountEntity account=accountRepo.findById(dto.getCustomerId()).orElseThrow(()-> new BadCredentialsException("account not found"));
        accountRepo.delete(account);
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
        System.out.println("LOGIN API HIT");
        return accountRepo.countByStatus("ACTIVE");
    }

    public List<accountResponse> getAccounts(String email) {
        userEntity user=userRepo.findByEmail(email).orElseThrow();
        List<accountEntity>accounts=user.getAccounts();
        return accounts.stream()
                .map(account->new accountResponse(
                        account.getAccountId(),
                        account.getAccountNumber(),
                        account.getStatus(),
                        account.getOpeningDate()
                )).toList();
    }
}