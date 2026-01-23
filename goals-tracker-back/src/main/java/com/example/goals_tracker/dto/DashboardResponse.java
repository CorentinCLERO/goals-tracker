package com.example.goals_tracker.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class DashboardResponse {
private long activeGoalsCount;
    private List<GoalSummary> recentGoals; 

    private List<HabitToday> habitsToday;

    private int currentGlobalStreak; 
    private long habitsCompletedTodayCount; 
}