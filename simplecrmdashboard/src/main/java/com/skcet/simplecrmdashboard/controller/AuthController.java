package com.skcet.simplecrmdashboard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skcet.simplecrmdashboard.configuration.JwtUtil;
import com.skcet.simplecrmdashboard.dto.AuthRequest;
import com.skcet.simplecrmdashboard.dto.AuthResponse;
import com.skcet.simplecrmdashboard.repository.UserRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepo, PasswordEncoder passwordEncoder, JwtUtil jwtUtil){
        this.userRepo=userRepo;
        this.passwordEncoder=passwordEncoder;
        this.jwtUtil=jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        var userOpt=userRepo.findByEmail(req.getEmail());
        if(userOpt.isEmpty()) return ResponseEntity.status(401).build();
        var user = userOpt.get();
        if(!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())){
            return ResponseEntity.status(401).build();
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, user.getName(), user.getRole().name()));
    }
    
}
