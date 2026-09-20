package com.fincore.transaction.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final SecretKey key;

    public JwtAuthFilter(
            @Value("${jwt.secret:FinCoreDigitalBankingPlatformSecureJwtSecretKey2026WithSufficientBitsForHmacSha256}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                Long userId = claims.get("userId", Long.class);
                String username = claims.getSubject();
                String role = claims.get("role", String.class);
                Long customerId = claims.get("customerId", Long.class);
                Long employeeId = claims.get("employeeId", Long.class);

                Set<String> authorities = new HashSet<>();
                Object authClaim = claims.get("authorities");
                if (authClaim instanceof Collection<?>) {
                    for (Object a : (Collection<?>) authClaim) {
                        if (a != null) authorities.add(a.toString());
                    }
                }

                UserContext context = UserContext.builder()
                        .userId(userId)
                        .username(username)
                        .role(role)
                        .customerId(customerId)
                        .employeeId(employeeId)
                        .authorities(authorities)
                        .build();

                UserContextHolder.setContext(context);

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
                log.debug("JWT parse bypassed in transaction-service: {}", e.getMessage());
            }
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            UserContextHolder.clear();
        }
    }
}
