package com.example.goals_tracker.dto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HabitStatsResponse {
    private String habitName; 
    private int currentStreak;
    private final double completionRate;
    private int longestStreak;
    private long totalCompleted;
}