package com.example.warehouse.controller;

import com.example.warehouse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.warehouse.entity.Product;
import com.example.warehouse.entity.User;
import com.example.warehouse.repository.ProductRepository;
import org.springframework.http.CacheControl;
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private boolean isSessionInvalid(String username, String sessionToken) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return true;

        // ADD THESE TWO LINES TO DEBUG:
        System.out.println("Comparing Tokens for User: " + username);
        System.out.println("From Browser: " + sessionToken + " | In Database: " + user.getSessionToken());

        return !sessionToken.equals(user.getSessionToken());
    }

    @GetMapping
    public ResponseEntity<?> getAllProducts(@RequestParam String username, @RequestParam String sessionToken) {
        if (isSessionInvalid(username, sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session Invalid.");
        }
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noCache()) // Force browser to ask server every time
                .body(productRepository.findAll());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createProduct(
            @RequestBody Product product,
            @RequestParam String username, 
            @RequestParam String sessionToken) {
        
        if (isSessionInvalid(username, sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session Invalid.");
        }
        return ResponseEntity.ok(productRepository.save(product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long id, 
            @RequestParam String username, 
            @RequestParam String sessionToken,
            @RequestParam String role) {
        
        if (isSessionInvalid(username, sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session Invalid.");
        }
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body("Only Admins can delete.");
        }
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(
            @PathVariable Long id, 
            @RequestParam String username, 
            @RequestParam String sessionToken) {
        
        if (isSessionInvalid(username, sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session Invalid.");
        }
        
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody Product productDetails,
            @RequestParam String username, 
            @RequestParam String sessionToken) {
        
        if (isSessionInvalid(username, sessionToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session Invalid.");
        }

        return productRepository.findById(id).map(product -> {
            product.setSku(productDetails.getSku());
            product.setName(productDetails.getName());
            product.setCategory(productDetails.getCategory());
            product.setPrice(productDetails.getPrice());
            product.setQuantity(productDetails.getQuantity());
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }
}
