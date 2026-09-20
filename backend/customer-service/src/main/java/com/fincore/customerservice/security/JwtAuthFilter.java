package com.fincore.customerservice.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtTokenProvider.validateToken(token)) {
                try {
                    Claims claims = jwtTokenProvider.getClaimsFromToken(token);
                    String username = claims.getSubject();
                    String role = claims.get("role", String.class);

                    Set<String> authorities = new HashSet<>();
                    Object authClaim = claims.get("authorities");
                    if (authClaim instanceof Collection<?>) {
                        for (Object a : (Collection<?>) authClaim) {
                            if (a != null) authorities.add(a.toString());
                        }
                    }

                    List<SimpleGrantedAuthority> springAuthorities = authorities.stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());
                    if (role != null) {
                        springAuthorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
                    }

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(username, null, springAuthorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                } catch (Exception e) {
                    log.debug("JWT parse bypassed in customer-service: {}", e.getMessage());
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
