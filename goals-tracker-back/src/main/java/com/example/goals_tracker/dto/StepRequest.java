package com.example.goals_tracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StepRequest {
  @NotBlank
  private String title;
  @NotBlank
  private String deadline;
  @NotNull(message = "Order is required")
  private Integer orderBy;
  private Boolean isCompleted;
  private String completedAt;
}
