package com.example.fincoredigitalbankingmanagementplatform2.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cglib.core.internal.Function;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class jwtService {
    @Value("${jwt.secret}")
    private String secret;
    private SecretKey signingKey(){
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    public String generateToken(String username){
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+1000*60*60))
                .signWith(signingKey())
                .compact();
    }
    public String extractUser(String Token){
        return extractClaim(Token, Claims::getSubject);
    }
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {

        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(signingKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public Date extractExpDate(String token){
        return extractClaim(token, Claims::getExpiration);
    }
    public Boolean isExpired(String token){
        return extractExpDate(token).before(new Date());
    }
    public Boolean isValid(String token,String username){
        if(extractUser(token).equals(username)&&!isExpired(token)){
            return Boolean.TRUE;
        }else return Boolean.FALSE;
    }


}
