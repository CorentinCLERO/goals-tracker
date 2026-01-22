package com.example.goals_tracker.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class HabitToday {
    private String name;
    private boolean isCompletedToday;
    private int currentStreak;
}