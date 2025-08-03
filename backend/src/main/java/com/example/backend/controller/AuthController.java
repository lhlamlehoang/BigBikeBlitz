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
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

class GoogleAuthRequest {
    @JsonProperty("credential")
    public String credential;
    
    public GoogleAuthRequest() {}
    
    public GoogleAuthRequest(String credential) {
        this.credential = credential;
    }
    
    @Override
    public String toString() {
        return "GoogleAuthRequest{credential='" + (credential != null ? credential.substring(0, Math.min(20, credential.length())) + "..." : "null") + "'}";
    }
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
        if (!user.isEnabled()) {
            return ResponseEntity.status(401).body(java.util.Collections.singletonMap("error", "Account is disabled. Please contact support."));
        }
        if (!user.isEmailVerified()) {
            return ResponseEntity.status(401).body(java.util.Collections.singletonMap("error", "Please verify your email address before logging in."));
        }
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
    public ResponseEntity<?> googleLogin(@RequestBody(required = false) GoogleAuthRequest request) {
        try {
            // Validate request
            if (request == null) {
                System.err.println("Google OAuth: Request body is null");
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Request body is null"));
            }
            
            System.out.println("Google OAuth: Received request object: " + request);
            
            if (request.credential == null || request.credential.trim().isEmpty()) {
                System.err.println("Google OAuth: Credential is null or empty");
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Google credential is null or empty"));
            }
            
            System.out.println("Received Google credential: " + request.credential.substring(0, Math.min(50, request.credential.length())) + "...");
            
            // For development: Extract email from JWT token without network verification
            String email = extractEmailFromJwt(request.credential);
            if (email == null) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Invalid Google token format"));
            }
            
            System.out.println("Extracted email from token: " + email);
            
            // First, check if a user with this email already exists
            Optional<User> existingUserByEmail = userRepository.findAll().stream()
                .filter(u -> email.equalsIgnoreCase(u.getEmail()))
                .findFirst();
            
            User user;
            if (existingUserByEmail.isPresent()) {
                // User exists with this email, use that account
                user = existingUserByEmail.get();
                System.out.println("Found existing user with email: " + email);
            } else {
                // Check if user exists by username (email)
                Optional<User> userOpt = userRepository.findByUsername(email);
                if (userOpt.isPresent()) {
                    // User exists by username, use that account
                    user = userOpt.get();
                    System.out.println("Found existing user by username: " + email);
                } else {
                    // Create new user
                    User newUser = new User();
                    newUser.setUsername(email);
                    newUser.setPassword(passwordEncoder.encode("google-oauth2-user"));
                    newUser.setEmail(email);
                    newUser.setRole("USER");
                    newUser.setAddress("");
                    newUser.setEmailVerified(true); // Google accounts are pre-verified
                    newUser.setEnabled(true);
                    user = userRepository.save(newUser);
                    System.out.println("Created new user with email: " + email);
                }
            }
            
            if (!user.isEnabled()) {
                return ResponseEntity.status(401).body(Collections.singletonMap("error", "Account is disabled. Please contact support."));
            }
            
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } catch (Exception e) {
            // Log the full exception for debugging
            System.err.println("Google OAuth error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Google login failed: " + e.getMessage()));
        }
    }
    
    private String extractEmailFromJwt(String jwtToken) {
        try {
            // Split the JWT token into parts
            String[] parts = jwtToken.split("\\.");
            if (parts.length != 3) {
                System.err.println("Invalid JWT format: expected 3 parts, got " + parts.length);
                return null;
            }
            
            // Decode the payload (second part)
            String payload = parts[1];
            
            // Add padding if necessary
            while (payload.length() % 4 != 0) {
                payload += "=";
            }
            
            // Replace URL-safe characters
            payload = payload.replace('-', '+').replace('_', '/');
            
            // Decode base64
            byte[] decodedBytes = java.util.Base64.getDecoder().decode(payload);
            String decodedPayload = new String(decodedBytes, "UTF-8");
            
            System.out.println("Decoded JWT payload: " + decodedPayload);
            
            // Parse JSON to extract email
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(decodedPayload);
            
            String email = jsonNode.get("email").asText();
            return email;
            
        } catch (Exception e) {
            System.err.println("Error extracting email from JWT: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    @PostMapping("/google/debug")
    public ResponseEntity<?> googleLoginDebug(@RequestBody String rawBody) {
        try {
            System.out.println("Raw request body: " + rawBody);
            return ResponseEntity.ok(Collections.singletonMap("message", "Debug endpoint - received: " + rawBody.substring(0, Math.min(100, rawBody.length()))));
        } catch (Exception e) {
            System.err.println("Debug endpoint error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Debug failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/google/test")
    public ResponseEntity<?> googleLoginTest() {
        try {
            return ResponseEntity.ok(Collections.singletonMap("message", "Test endpoint working"));
        } catch (Exception e) {
            System.err.println("Test endpoint error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Test failed: " + e.getMessage()));
        }
    }
} 