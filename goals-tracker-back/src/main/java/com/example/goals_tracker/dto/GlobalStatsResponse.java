package com.example.goals_tracker.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GlobalStatsResponse {
    private long totalGoalsCompleted;
    private long totalHabitLogs;
    private double globalSuccessRate;
    private int longestStreakRecord;
    private int totalXP;
}