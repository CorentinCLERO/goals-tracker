package com.example.goals_tracker.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.goals_tracker.dto.StepRequest;
import com.example.goals_tracker.dto.StepResponse;
import com.example.goals_tracker.model.Goal;
import com.example.goals_tracker.model.Step;
import com.example.goals_tracker.repository.GoalRepository;
import com.example.goals_tracker.repository.StepRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StepService {
  private final StepRepository stepRepository;
  private final GoalRepository goalRepository;

  public StepResponse createStep(StepRequest stepRequest, UUID goalId) {

    // Get the authenticated user ID from SecurityContext
    UUID userId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    Goal goal = goalRepository.findById(goalId)
        .orElseThrow(() -> new RuntimeException("Goal not found"));

    // Check if the goal belongs to the authenticated user
    if (!goal.getUser().getId().equals(userId)) {
      throw new RuntimeException("Unauthorized: Goal does not belong to user");
    }

    Step step = Step.builder()
      .title(stepRequest.getTitle())
      .deadline(LocalDateTime.parse(stepRequest.getDeadline()))
      .orderBy(stepRequest.getOrderBy())
      .isCompleted(stepRequest.getIsCompleted())
      .goal(goal)
      .build();

    Step newStep = stepRepository.save(step);

    return StepResponse.from(newStep);
  }

}
