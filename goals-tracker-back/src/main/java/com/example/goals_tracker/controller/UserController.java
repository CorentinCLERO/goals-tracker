package com.example.goals_tracker.controller;

import com.example.goals_tracker.dto.CreateUserRequest;
import com.example.goals_tracker.dto.LoginRequest;
import com.example.goals_tracker.dto.LoginResponse;
import com.example.goals_tracker.dto.UserResponse;
import com.example.goals_tracker.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        log.info("Creating user with email: {}", request.getEmail());
        UserResponse userResponse = userService.createUser(request);
        log.info("User created successfully with ID: {}", userResponse.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();        
        UUID userId = (UUID) auth.getPrincipal();

        UserResponse user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }
}