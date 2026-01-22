package com.example.warehouse.service;
import com.example.warehouse.entity.User;
import com.example.warehouse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{
	@Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User saveUser(User user) {
        // 1. Encrypt the password before saving
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        
        // 2. Set a default role
        user.setRole("ROLE_USER");
        
        // 3. Save to database
        return userRepository.save(user);
    }
    
    @Override
    public User loginUser(String username, String password) {
        // 1. Find user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // 2. Check if password matches
        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        } else {
            throw new RuntimeException("Invalid Password!");
        }
    }
}
