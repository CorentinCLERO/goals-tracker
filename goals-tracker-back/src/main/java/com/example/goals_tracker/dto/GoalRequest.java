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
    @NotBlank
    private String description;
    @NotBlank
    private String category;
    @NotBlank
    private String priority;
    @NotBlank
    private String status;
    @NotBlank
    private String startDate;
    @NotBlank
    private String deadline;
}
