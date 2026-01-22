package com.example.goals_tracker.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_badges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(UserBadgeId.class)
public class UserBadge {
    
    @Id
    @Column(name = "user_id")
    private UUID userId;
    
    @Id
    @Column(name = "badge_id")
    private UUID badgeId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "badge_id", insertable = false, updatable = false)
    private Badge badge;
    
    @Column(name = "earned_at", nullable = false)
    private LocalDateTime earnedAt;
    
    @PrePersist
    protected void onCreate() {
        if (earnedAt == null) {
            earnedAt = LocalDateTime.now();
        }
    }
}