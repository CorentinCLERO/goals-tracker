package com.example.goals_tracker.dto;

import com.example.goals_tracker.model.Step;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class StepResponse {
  private String id;
  private String title;
  private String deadline;
  private Boolean isCompleted;
  private Integer orderBy;
  private String goal;
  private String completedAt;
  private String createdAt;

  public static StepResponse from(Step step) {
      return StepResponse.builder()
              .id(step.getId().toString())
              .title(step.getTitle())
              .deadline(step.getDeadline().toString())
              .isCompleted(step.getIsCompleted())
              .orderBy(step.getOrderBy())
              .goal(step.getGoal().toString())
              .completedAt(step.getCompletedAt() != null ? step.getCompletedAt().toString() : null)
              .createdAt(step.getCreatedAt().toString())
              .build();
  }
}
