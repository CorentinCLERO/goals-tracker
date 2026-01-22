package com.example.goals_tracker.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class GoalProgressResponse {
    private UUID goalId;
    private double progress;
    private long completedSteps;
    private long totalSteps;
}