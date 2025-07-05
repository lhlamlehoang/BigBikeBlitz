package com.example.backend.controller;

import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import com.example.backend.model.User;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public Map<String, Object> getProfile(Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("username", user.getUsername());
        result.put("email", user.getEmail()); 
        result.put("phone", user.getPhone());  
        result.put("role", user.getRole());     
        result.put("enabled", user.isEnabled()); 
        return result;
    }

    @PutMapping("/profile")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateProfile(Authentication auth, @RequestBody Map<String, String> body) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        System.out.println(user.getRole());
        if (body.containsKey("email")) user.setEmail(body.get("email"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        userRepository.save(user);
    }
} 