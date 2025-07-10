package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import javax.net.ssl.*;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.KeyStore;
import java.security.cert.X509Certificate;

@Configuration
public class SslConfig {

    @Bean
    @Primary
    public SSLContext sslContext() throws NoSuchAlgorithmException, KeyManagementException {
        SSLContext sslContext = SSLContext.getInstance("TLS");
        
        try {
            // Use the system default trust store which includes our custom certificate
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            tmf.init((KeyStore) null); // Use system default
            
            sslContext.init(null, tmf.getTrustManagers(), new java.security.SecureRandom());
            
            // Set the default SSL context
            HttpsURLConnection.setDefaultSSLSocketFactory(sslContext.getSocketFactory());
            
            System.out.println("SSL Context configured with system trust store (includes tma.crt)");
            
        } catch (Exception e) {
            System.err.println("Warning: Could not configure SSL context with system trust store: " + e.getMessage());
            // Fallback to default SSL context
            sslContext = SSLContext.getDefault();
        }
        
        return sslContext;
    }
} 