package com.example.goals_tracker.service;

import com.example.goals_tracker.dto.BadgeData;
import com.example.goals_tracker.model.Badge;
import com.example.goals_tracker.model.User;
import com.example.goals_tracker.model.UserBadge;
import com.example.goals_tracker.repository.BadgeRepository;
import com.example.goals_tracker.repository.GoalRepository;
import com.example.goals_tracker.repository.HabitRepository;
import com.example.goals_tracker.repository.UserBadgeRepository;
import com.example.goals_tracker.repository.UserRepository;
import com.example.goals_tracker.model.StatusEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BadgeService {
    
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final UserRepository userRepository;
    private final GoalRepository goalRepository;
    private final HabitRepository habitRepository;
    
    public List<BadgeData> getAllBadges() {
        return badgeRepository.findAll().stream()
            .map(BadgeData::from)
            .collect(Collectors.toList());
    }
    
    public List<BadgeData> getUserBadges(UUID userId) {
        List<UserBadge> userBadges = userBadgeRepository.findByUserIdWithBadges(userId);
        return userBadges.stream()
            .map(userBadge -> {
                BadgeData badgeData = BadgeData.from(userBadge.getBadge());
                badgeData.setEarnedAt(userBadge.getEarnedAt());
                return badgeData;
            })
            .collect(Collectors.toList());
    }
    
    public void checkAndAwardBadges(UUID userId) {
        checkFinisherBadge(userId);
        
        checkCommitmentBadge(userId);
    }
    
    private void checkFinisherBadge(UUID userId) {
        Badge finisherBadge = badgeRepository.findByName("Finisher")
            .orElse(null);
        
        if (finisherBadge == null || userBadgeRepository.existsByUserIdAndBadgeId(userId, finisherBadge.getId())) {
            return;
        }
        
        long completedGoals = goalRepository.countByUserIdAndStatus(userId, StatusEnum.COMPLETED);
        
        if (completedGoals >= 5) {
            awardBadge(userId, finisherBadge.getId());
        }
    }
    
    private void checkCommitmentBadge(UUID userId) {
        Badge commitmentBadge = badgeRepository.findByName("Commitment")
            .orElse(null);
        
        if (commitmentBadge == null || userBadgeRepository.existsByUserIdAndBadgeId(userId, commitmentBadge.getId())) {
            return;
        }
    }
    
    private void awardBadge(UUID userId, UUID badgeId) {
        UserBadge userBadge = UserBadge.builder()
            .userId(userId)
            .badgeId(badgeId)
            .earnedAt(LocalDateTime.now())
            .build();
        
        userBadgeRepository.save(userBadge);
    }
}