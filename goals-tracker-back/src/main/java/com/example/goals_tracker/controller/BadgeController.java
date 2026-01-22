package com.example.goals_tracker.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.goals_tracker.dto.BadgeData;
import com.example.goals_tracker.service.BadgeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class BadgeController {
    
    private final BadgeService badgeService;
    
    @GetMapping("/badges")
    public ResponseEntity<List<BadgeData>> getAllBadges() {
        log.info("Fetching all available badges");
        List<BadgeData> badges = badgeService.getAllBadges();
        log.info("Found {} badges", badges.size());
        return ResponseEntity.ok(badges);
    }
    
    @GetMapping("/users/me/badges")
    public ResponseEntity<List<BadgeData>> getUserBadges() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();        
        UUID userId = (UUID) auth.getPrincipal();
        log.info("Fetching badges for user with ID: {}", userId);

        List<BadgeData> userBadges = badgeService.getUserBadges(userId);
        log.info("Found {} badges for user ID: {}", userBadges.size(), userId);
        return ResponseEntity.ok(userBadges);
    }
}