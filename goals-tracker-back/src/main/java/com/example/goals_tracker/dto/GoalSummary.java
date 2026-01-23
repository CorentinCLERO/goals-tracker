package com.example.goals_tracker.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class GoalSummary {
    private String title;
    private int progressPercentage; 
    private String priority;
}