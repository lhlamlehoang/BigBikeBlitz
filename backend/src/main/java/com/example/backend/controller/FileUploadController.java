package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api")
public class FileUploadController {
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file selected");
        }
        try {
            // Save to frontend/public/assets
            String uploadDir = "../frontend/public/assets/";
            File dest = new File(uploadDir + file.getOriginalFilename());
            file.transferTo(dest);
            String relativePath = "../public/assets/" + file.getOriginalFilename();
            return ResponseEntity.ok().body(relativePath);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        }
    }
} 