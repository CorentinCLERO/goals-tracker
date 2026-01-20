package com.example.goals_tracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GoalRequest {
    @NotBlank
    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;
    private String startDate;
    private String deadline;
}
