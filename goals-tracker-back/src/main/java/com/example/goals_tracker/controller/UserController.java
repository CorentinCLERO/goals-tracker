package com.example.goals_tracker.controller;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.goals_tracker.dto.CreateUserRequest;
import com.example.goals_tracker.dto.LoginRequest;
import com.example.goals_tracker.dto.LoginResponse;
import com.example.goals_tracker.dto.UpdateUserRequest;
import com.example.goals_tracker.dto.UserResponse;
import com.example.goals_tracker.dto.UserXpData;
import com.example.goals_tracker.service.UserService;
import com.example.goals_tracker.service.XpService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserService userService;
    private final XpService xpService;
    
    @PostMapping("/auth/register")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        log.info("Creating user with email: {}", request.getEmail());
        UserResponse userResponse = userService.createUser(request);
        log.info("User created successfully with ID: {}", userResponse.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
    }
    
    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/auth/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();        
        UUID userId = (UUID) auth.getPrincipal();

        UserResponse user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/users/me/xp")
    public ResponseEntity<UserXpData> getCurrentUserXp() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();        
        UUID userId = (UUID) auth.getPrincipal();
        log.info("Fetching XP information for user with ID: {}", userId);

        UserXpData xpInfo = xpService.getUserXpInfo(userId);
        log.info("User XP info retrieved - Level: {}, XP: {} for user ID: {}", 
                xpInfo.getLevel(), xpInfo.getXpPoints(), userId);
        return ResponseEntity.ok(xpInfo);
    }
    
    @PutMapping("/auth/me")
    public ResponseEntity<UserResponse> updateCurrentUser(@Valid @RequestBody UpdateUserRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();        
        UUID userId = (UUID) auth.getPrincipal();

        log.info("Updating user with ID: {}", userId);
        UserResponse updatedUser = userService.updateUser(userId, request);
        log.info("User updated successfully with ID: {}", updatedUser.getId());
        return ResponseEntity.ok(updatedUser);
    }
}