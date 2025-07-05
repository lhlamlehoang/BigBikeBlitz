package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Map;

@RestController
public class RegisterController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(
                java.util.Collections.singletonMap("error", "Username already exists")
            );
        }
        String password = user.getPassword();
        if (password == null ||
            password.length() < 8 || password.length() > 12 ||
            !password.matches(".*[a-z].*") ||
            !password.matches(".*[A-Z].*") ||
            !password.matches(".*[0-9].*")) {
            return ResponseEntity.badRequest().body(
                java.util.Collections.singletonMap(
                    "error",
                    "Password must be 8-12 characters and include lower, upper case, digit, and symbol."
                )
            );
        }
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("USER");
        user.setEnabled(true);
        userRepository.save(user);
        return ResponseEntity.status(201).build();
    }
} 