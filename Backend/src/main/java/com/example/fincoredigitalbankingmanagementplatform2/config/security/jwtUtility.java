package com.example.fincoredigitalbankingmanagementplatform2.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class jwtUtility extends OncePerRequestFilter {
    @Autowired
    private jwtService service;
    @Autowired
    private userDetailService userservice;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException, ServletException, IOException {
        String Authheader=request.getHeader("Authorization");
        if(Authheader==null||!Authheader.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }
        String token=Authheader.substring(7);
        String username=service.extractUser(token);
        if(username==null|| SecurityContextHolder.getContext().getAuthentication()==null){
            UserDetails userdetail=userservice.loadUserByUsername(username);
            if(service.isValid(token,username)){
                UsernamePasswordAuthenticationToken authToken=new UsernamePasswordAuthenticationToken(userdetail,null,userdetail.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource()
                        .buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request,response);

    }
}
