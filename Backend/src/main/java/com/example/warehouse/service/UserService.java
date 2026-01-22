package com.example.warehouse.service;
import com.example.warehouse.entity.User;
public interface UserService {
	// This defines the "contract" for saving a user
    User saveUser(User user);
    User loginUser(String username, String password);
    
    // Later we can add more methods here, like:
    // User findByUsername(String username);
}
