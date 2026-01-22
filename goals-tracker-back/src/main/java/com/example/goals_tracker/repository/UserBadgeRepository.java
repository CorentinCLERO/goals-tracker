package com.example.goals_tracker.repository;

import com.example.goals_tracker.model.UserBadge;
import com.example.goals_tracker.model.UserBadgeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, UserBadgeId> {
    
    List<UserBadge> findByUserId(UUID userId);
    
    boolean existsByUserIdAndBadgeId(UUID userId, UUID badgeId);
    
    @Query("SELECT ub FROM UserBadge ub JOIN FETCH ub.badge WHERE ub.userId = :userId ORDER BY ub.earnedAt DESC")
    List<UserBadge> findByUserIdWithBadges(UUID userId);
}