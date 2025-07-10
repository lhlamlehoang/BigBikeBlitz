package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        // Configure system properties to prevent proxy parsing issues
        System.setProperty("com.google.api.client.should_use_proxy", "false");
        System.setProperty("http.proxyHost", "localhost");
        System.setProperty("http.proxyPort", "0");
        System.setProperty("https.proxyHost", "localhost");
        System.setProperty("https.proxyPort", "0");
        System.setProperty("http.nonProxyHosts", "*");
        
        SpringApplication.run(BackendApplication.class, args);
    }
} 