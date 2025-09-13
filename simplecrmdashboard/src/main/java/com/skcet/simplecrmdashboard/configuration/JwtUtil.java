package com.skcet.simplecrmdashboard.configuration;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    private final Key key;
    private final long expirationMs;

    public JwtUtil(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration-ms}") long expirationMs){
        if(secret==null || secret.length()<32){
            secret="asdafafaosaso2q3820asjjda9232-sjada-2jasdnasd-292";
        }
        this.key=Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs=expirationMs;
    }

    public String generateToken(String subject, String role){
        Date now= new Date();
        Date exp=new Date(now.getTime() + expirationMs);
        return Jwts.builder()
            .setSubject(subject)
            .claim("role", role)
            .setIssuedAt(now)
            .setExpiration(exp)
            .signWith(key)
            .compact();
    }

    public Jws<Claims>parseToken(String token){
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }
}
