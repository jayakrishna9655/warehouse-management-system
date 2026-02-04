package com.example.warehouse.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;
    
 // Inside User.java
    @Column(nullable = false)
    private String role = "USER"; // Default every new user to 'USER'
    @Column(nullable = true)
    private String sessionToken;
    
    // New field for security expiration
    private LocalDateTime tokenExpiry;
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

   
    public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }

    public LocalDateTime getTokenExpiry() { return tokenExpiry; }
    public void setTokenExpiry(LocalDateTime tokenExpiry) { this.tokenExpiry = tokenExpiry; }
    
    // Getters and setters (or Lombok)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getSessionToken() { 
        return sessionToken;
    }

 

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

 
}
