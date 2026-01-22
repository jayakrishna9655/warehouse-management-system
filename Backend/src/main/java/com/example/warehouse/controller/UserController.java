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

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@RequestBody UserRequest userRequest) {
        // 1. Convert DTO to Entity
        User userEntity = new User();
        userEntity.setUsername(userRequest.getUsername());
        userEntity.setPassword(userRequest.getPassword());

        // 2. Save using Service
        User savedUser = userService.saveUser(userEntity);

        // 3. Convert Entity to Response DTO (Hide the password!)
        UserResponse response = new UserResponse(
            savedUser.getId(), 
            savedUser.getUsername(), 
            savedUser.getRole()
        );

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest userRequest) {
        // 1. Call the service logic
        User user = userService.loginUser(userRequest.getUsername(), userRequest.getPassword());

        // 2. Map to Response DTO
        UserResponse response = new UserResponse(
            user.getId(), 
            user.getUsername(), 
            user.getRole()
        );

        return ResponseEntity.ok(response);
    }
}