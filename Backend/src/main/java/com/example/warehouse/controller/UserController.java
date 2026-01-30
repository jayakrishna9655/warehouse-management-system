package com.example.warehouse.controller;

import com.example.warehouse.dto.UserRequest;
import com.example.warehouse.dto.UserResponse;
import com.example.warehouse.entity.User;
import com.example.warehouse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Consolidated Register Method
     * Handles creating a new user and assigning a role (ADMIN/USER).
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@RequestBody UserRequest userRequest) {
        // 1. Create the Entity from the Request DTO
        User userEntity = new User();
        userEntity.setUsername(userRequest.getUsername());
        userEntity.setPassword(userRequest.getPassword());

        // 2. Handle the Role assignment logic
        // If role is missing from frontend, we default to "USER"
        if (userRequest.getRole() == null || userRequest.getRole().isEmpty()) {
            userEntity.setRole("USER");
        } else {
            userEntity.setRole(userRequest.getRole());
        }

        // 3. Save using the Service
        User savedUser = userService.saveUser(userEntity);

        // 4. Map the saved Entity back to a Response DTO (Hide the password)
        UserResponse response = new UserResponse(
            savedUser.getId(), 
            savedUser.getUsername(), 
            savedUser.getRole(),
            null
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest userRequest) {
        // 1. Authenticate using Service logic
        User user = userService.loginUser(userRequest.getUsername(), userRequest.getPassword());

        // 2. Map to Response DTO to send role/id to Angular
        UserResponse response = new UserResponse(
            user.getId(), 
            user.getUsername(), 
            user.getRole(),
            user.getSessionToken()
        );

        return ResponseEntity.ok(response);
    }
}