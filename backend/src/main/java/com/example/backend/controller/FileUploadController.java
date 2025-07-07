package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api")
public class FileUploadController {
    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file selected");
        }
        try {
            // Resolve to absolute path
            String absoluteUploadDir = Paths.get(uploadDir).toAbsolutePath().toString();
            File dir = new File(absoluteUploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            File dest = new File(dir, file.getOriginalFilename());
            file.transferTo(dest);
            return ResponseEntity.ok("/uploads/" + file.getOriginalFilename());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        }
    }
} 