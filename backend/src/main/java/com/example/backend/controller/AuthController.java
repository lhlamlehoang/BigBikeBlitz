package com.example.backend.controller;

import com.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import java.util.Collections;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import java.util.Optional;

class GoogleAuthRequest {
    @JsonProperty("credential")
    public String credential;
}

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<?> loginSimple(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        var userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(java.util.Collections.singletonMap("error", "Invalid username or password"));
        }
        var user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body(java.util.Collections.singletonMap("error", "Invalid username or password"));
        }
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.ok(java.util.Map.of(
            "message", "Login successful",
            "token", token,
            "role", user.getRole()
        ));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleAuthRequest request) {
        try {
            GoogleIdTokenVerifier verifier =
                new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    JacksonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList("289507347461-mgafjfuj13imphhd4kdja07ukpuh7n13.apps.googleusercontent.com"))
                    .build();
            GoogleIdToken idToken = verifier.verify(request.credential);
            if (idToken == null) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Invalid Google token"));
            }
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            Optional<User> userOpt = userRepository.findByUsername(email);
            User user = userOpt.orElseGet(() -> {
                User newUser = new User();
                newUser.setUsername(email);
                newUser.setPassword(passwordEncoder.encode("google-oauth2-user"));
                newUser.setEmail(email);
                newUser.setRole("USER");
                return userRepository.save(newUser);
            });
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Google login failed: " + e.getMessage()));
        }
    }
} 