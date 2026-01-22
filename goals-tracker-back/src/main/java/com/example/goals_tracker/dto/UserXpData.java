package com.example.goals_tracker.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserXpData {
    private Integer xpPoints;
    private Integer level;
    private String levelName;
    private Integer xpNeededForNextLevel;
    private Integer totalBadges;
}