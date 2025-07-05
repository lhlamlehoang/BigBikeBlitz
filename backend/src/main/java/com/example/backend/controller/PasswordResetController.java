package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.model.PasswordResetToken;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/password-reset")
public class PasswordResetController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @PostMapping("/request")
    public Map<String, Object> requestReset(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Map<String, Object> response = new HashMap<>();
        if (email == null || email.isEmpty()) {
            response.put("success", false);
            response.put("message", "Email is required");
            return response;
        }
        Optional<User> userOpt = userRepository.findAll().stream().filter(u -> email.equalsIgnoreCase(u.getEmail())).findFirst();
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            LocalDateTime expiry = LocalDateTime.now().plusHours(1);
            PasswordResetToken resetToken = new PasswordResetToken(token, user, expiry);
            tokenRepository.findByUser(user).ifPresent(tokenRepository::delete); // Remove old tokens
            tokenRepository.save(resetToken);
            // Send email
            String resetLink = "http://localhost:5173/reset?token=" + token;
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Password Reset Request");
            message.setText("To reset your password, click the link below:\n" + resetLink + "\nThis link will expire in 1 hour.");
            mailSender.send(message);
        }
        // Always return success for security
        response.put("success", true);
        response.put("message", "If an account with that email exists, a reset link has been sent.");
        return response;
    }

    @PostMapping("/confirm")
    public Map<String, Object> confirmReset(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("password");
        Map<String, Object> response = new HashMap<>();
        if (token == null || newPassword == null || newPassword.length() < 6) {
            response.put("success", false);
            response.put("message", "Invalid token or password");
            return response;
        }
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty() || tokenOpt.get().getExpiryDate().isBefore(LocalDateTime.now())) {
            response.put("success", false);
            response.put("message", "Invalid or expired token");
            return response;
        }
        PasswordResetToken resetToken = tokenOpt.get();
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(resetToken);
        response.put("success", true);
        response.put("message", "Password has been reset successfully");
        return response;
    }
} 