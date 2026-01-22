package com.example.goals_tracker.dto;

import com.example.goals_tracker.model.Badge;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BadgeData {
    private UUID id;
    private String name;
    private String description;
    private String icon;
    private String criteria;
    private LocalDateTime earnedAt;
    
    public static BadgeData from(Badge badge) {
        return BadgeData.builder()
            .id(badge.getId())
            .name(badge.getName())
            .description(badge.getDescription())
            .icon(badge.getIcon())
            .criteria(badge.getCriteria())
            .build();
    }
}