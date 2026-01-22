package com.example.goals_tracker.service;

import com.example.goals_tracker.dto.UserXpData;
import com.example.goals_tracker.model.User;
import com.example.goals_tracker.repository.UserBadgeRepository;
import com.example.goals_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.goals_tracker.exception.BeanNotFoundException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class XpService {
    
    private final UserRepository userRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final BadgeService badgeService;
    
    public static final int XP_COMPLETE_STEP = 10;
    public static final int XP_COMPLETE_GOAL = 50;
    public static final int XP_COMPLETE_HABIT = 5;
    public static final int XP_STREAK_7_DAYS = 30;
    public static final int XP_STREAK_30_DAYS = 100;
    
    public UserXpData getUserXpInfo(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BeanNotFoundException("User not found"));
        
        int totalBadges = userBadgeRepository.findByUserId(userId).size();
        
        return UserXpData.builder()
            .xpPoints(user.getXpPoints())
            .level(user.getLevel())
            .levelName(getLevelName(user.getLevel()))
            .xpNeededForNextLevel(getXpNeededForNextLevel(user.getXpPoints()))
            .currentLevelXp(getCurrentLevelXp(user.getLevel()))
            .nextLevelXp(getNextLevelXp(user.getLevel()))
            .totalBadges(totalBadges)
            .build();
    }
    
    public void addXpToUser(UUID userId, int xpAmount) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BeanNotFoundException("User not found"));
        
        user.setXpPoints(user.getXpPoints() + xpAmount);
        user.setLevel(calculateLevel(user.getXpPoints()));
        
        userRepository.save(user);
        
        badgeService.checkAndAwardBadges(userId);
    }
    
    private int calculateLevel(int xpPoints) {
        if (xpPoints < 100) return 1;
        if (xpPoints < 300) return 2;
        if (xpPoints < 600) return 3;
        if (xpPoints < 1000) return 4;
        return 5;
    }
    
    private String getLevelName(int level) {
        return switch (level) {
            case 1 -> "Débutant";
            case 2 -> "Motivé";
            case 3 -> "Discipliné";
            case 4 -> "Expert";
            case 5 -> "Maître";
            default -> "Débutant";
        };
    }
    
    private int getXpNeededForNextLevel(int currentXp) {
        if (currentXp < 100) return 100 - currentXp;
        if (currentXp < 300) return 300 - currentXp;
        if (currentXp < 600) return 600 - currentXp;
        if (currentXp < 1000) return 1000 - currentXp;
        return 0;
    }
    
    private int getCurrentLevelXp(int level) {
        return switch (level) {
            case 1 -> 0;
            case 2 -> 100;
            case 3 -> 300;
            case 4 -> 600;
            case 5 -> 1000;
            default -> 0;
        };
    }
    
    private int getNextLevelXp(int level) {
        return switch (level) {
            case 1 -> 100;
            case 2 -> 300;
            case 3 -> 600;
            case 4 -> 1000;
            case 5 -> 1000;
            default -> 100;
        };
    }
}