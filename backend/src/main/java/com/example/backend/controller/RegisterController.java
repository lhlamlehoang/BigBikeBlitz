package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.backend.model.User;
import com.example.backend.model.EmailVerificationToken;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.EmailVerificationTokenRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Map;
import java.util.UUID;
import java.time.LocalDateTime;

@RestController
public class RegisterController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailVerificationTokenRepository emailVerificationTokenRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Check if username already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(
                java.util.Collections.singletonMap("error", "Username already exists")
            );
        }

        // Check if email already exists
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            if (userRepository.findAll().stream().anyMatch(u -> user.getEmail().equalsIgnoreCase(u.getEmail()))) {
                return ResponseEntity.badRequest().body(
                    java.util.Collections.singletonMap("error", "Email already exists")
                );
            }
        }

        // Validate email is provided
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                java.util.Collections.singletonMap("error", "Email is required")
            );
        }

        // Validate email format
        if (!user.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return ResponseEntity.badRequest().body(
                java.util.Collections.singletonMap("error", "Invalid email format")
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
        user.setEnabled(false); // User will be enabled after email verification
        user.setEmailVerified(false);
        userRepository.save(user);

        // Create email verification token
        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusHours(24);
        EmailVerificationToken verificationToken = new EmailVerificationToken(token, user, expiry);
        emailVerificationTokenRepository.save(verificationToken);

        // Send verification email
        String verificationLink = frontendUrl + "/verify-email?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(user.getEmail());
        message.setSubject("Email Verification - BigBikeBlitz");
        message.setText("Welcome to BigBikeBlitz!\n\n" +
                       "Please verify your email address by clicking the link below:\n" +
                       verificationLink + "\n\n" +
                       "This link will expire in 24 hours.\n\n" +
                       "If you didn't create an account, please ignore this email.");

        try {
            mailSender.send(message);
        } catch (Exception e) {
            // If email sending fails, delete the user and token
            emailVerificationTokenRepository.delete(verificationToken);
            userRepository.delete(user);
            return ResponseEntity.badRequest().body(
                java.util.Collections.singletonMap("error", "Failed to send verification email. Please try again.")
            );
        }

        return ResponseEntity.status(201).body(
            java.util.Collections.singletonMap("message", "Registration successful! Please check your email to verify your account.")
        );
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body(
                java.util.Collections.singletonMap("error", "Token is required")
            );
        }

        var tokenOpt = emailVerificationTokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(
                java.util.Collections.singletonMap("error", "Invalid verification token")
            );
        }

        EmailVerificationToken verificationToken = tokenOpt.get();
        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            emailVerificationTokenRepository.delete(verificationToken);
            return ResponseEntity.badRequest().body(
                java.util.Collections.singletonMap("error", "Verification token has expired")
            );
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        user.setEnabled(true);
        userRepository.save(user);
        emailVerificationTokenRepository.delete(verificationToken);

        return ResponseEntity.ok(
            java.util.Collections.singletonMap("message", "Email verified successfully! You can now log in.")
        );
    }
} 