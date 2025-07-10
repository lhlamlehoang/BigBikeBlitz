package com.example.backend.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(1)
public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        // Log Google OAuth requests
        if (httpRequest.getRequestURI().contains("/api/auth/google")) {
            System.out.println("=== Request Logging Filter ===");
            System.out.println("URI: " + httpRequest.getRequestURI());
            System.out.println("Method: " + httpRequest.getMethod());
            System.out.println("Content-Type: " + httpRequest.getContentType());
            System.out.println("Content-Length: " + httpRequest.getContentLength());
            System.out.println("User-Agent: " + httpRequest.getHeader("User-Agent"));
            System.out.println("Origin: " + httpRequest.getHeader("Origin"));
            System.out.println("Referer: " + httpRequest.getHeader("Referer"));
            System.out.println("===============================");
        }
        
        chain.doFilter(request, response);
    }
} 