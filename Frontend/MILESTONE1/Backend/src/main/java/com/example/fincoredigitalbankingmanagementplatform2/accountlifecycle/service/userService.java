package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.service;

import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO.loginDTO;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO.registerDTO;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.entity.userEntity;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.repo.userRepo;
import com.example.fincoredigitalbankingmanagementplatform2.config.security.jwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class userService {

    @Autowired
    private jwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private userRepo repo;
    public String login(loginDTO loginDTO) {
        userEntity user=repo.findByEmail(loginDTO.getEmail()).orElseThrow(() ->
                new UsernameNotFoundException("Invalid email or password"));
        Boolean match=passwordEncoder.matches(loginDTO.getPassword(), user.getPassword());
        if(!match) throw  new BadCredentialsException("Incorrect Password");

        return jwtService.generateToken(user.getEmail());
    }


    public void register(registerDTO registerDTO) {
        userEntity user=new userEntity();
        user.setEmail(registerDTO.getEmail());
        user.setFirstName(registerDTO.getFirstName());
        user.setLastName(registerDTO.getLastName());
        user.setPhone(registerDTO.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        repo.save(user);
    }
}
