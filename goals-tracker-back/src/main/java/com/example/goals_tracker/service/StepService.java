package com.example.goals_tracker.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.goals_tracker.dto.StepRequest;
import com.example.goals_tracker.dto.StepResponse;
import com.example.goals_tracker.dto.UpdateStepRequest;
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

    // Get existing steps to determine next Position value
    List<Step> existingSteps = stepRepository.findByGoalIdOrderByPositionAsc(goalId);
    Integer nextPosition = existingSteps.stream()
        .map(Step::getPosition)
        .max(Integer::compareTo)
        .map(max -> max + 1)
        .orElse(1);

    Step step = Step.builder()
      .title(stepRequest.getTitle())
      .deadline(LocalDateTime.parse(stepRequest.getDeadline()))
      .position(nextPosition)
      .isCompleted(stepRequest.getIsCompleted())
      .goal(goal)
      .build();

    Step newStep = stepRepository.save(step);

    return StepResponse.from(newStep);
  }

  public List<StepResponse> listGoalSteps(UUID goalId) {
    // Get the authenticated user ID from SecurityContext
    UUID userId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    Goal goal = goalRepository.findById(goalId)
        .orElseThrow(() -> new RuntimeException("Goal not found"));

    // Check if the goal belongs to the authenticated user
    if (!goal.getUser().getId().equals(userId)) {
      throw new RuntimeException("Unauthorized: Goal does not belong to user");
    };

    List<Step> steps = stepRepository.findByGoalIdOrderByPositionAsc(goalId);

    return steps.stream().map(StepResponse::from).toList();
  }

  public StepResponse updateStep(UUID goalId, UUID stepId, UpdateStepRequest updateRequest) {
    // Get the authenticated user ID from SecurityContext
    UUID userId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    Goal goal = goalRepository.findById(goalId)
        .orElseThrow(() -> new RuntimeException("Goal not found"));

    // Check if the goal belongs to the authenticated user
    if (!goal.getUser().getId().equals(userId)) {
      throw new RuntimeException("Unauthorized: Goal does not belong to user");
    }

    Step step = stepRepository.findById(stepId)
        .orElseThrow(() -> new RuntimeException("Step not found"));

    // Verify the step belongs to the goal
    if (!step.getGoal().getId().equals(goalId)) {
      throw new RuntimeException("Step does not belong to this goal");
    }

    Integer oldPosition = step.getPosition();
    Integer newPosition = updateRequest.getPosition();

    // Handle position change - reorder other steps
    if (newPosition != null && !newPosition.equals(oldPosition)) {
      List<Step> allSteps = stepRepository.findByGoalIdOrderByPositionAsc(goalId);
      
      if (newPosition < oldPosition) {
        // Moving up: increment position for steps between new and old position
        for (Step s : allSteps) {
          if (!s.getId().equals(stepId) && s.getPosition() >= newPosition && s.getPosition() < oldPosition) {
            s.setPosition(s.getPosition() + 1);
            stepRepository.save(s);
          }
        }
      } else {
        // Moving down: decrement position for steps between old and new position
        for (Step s : allSteps) {
          if (!s.getId().equals(stepId) && s.getPosition() > oldPosition && s.getPosition() <= newPosition) {
            s.setPosition(s.getPosition() - 1);
            stepRepository.save(s);
          }
        }
      }
      
      step.setPosition(newPosition);
    }

    // Update other fields
    if (updateRequest.getTitle() != null) {
      step.setTitle(updateRequest.getTitle());
    }
    if (updateRequest.getDeadline() != null) {
      step.setDeadline(LocalDateTime.parse(updateRequest.getDeadline()));
    }

    Step updatedStep = stepRepository.save(step);
    return StepResponse.from(updatedStep);
  }

  public StepResponse completeStep(UUID goalId, UUID stepId, boolean completed) {
    // Get the authenticated user ID from SecurityContext
    UUID userId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    Goal goal = goalRepository.findById(goalId)
        .orElseThrow(() -> new RuntimeException("Goal not found"));

    // Check if the goal belongs to the authenticated user
    if (!goal.getUser().getId().equals(userId)) {
      throw new RuntimeException("Unauthorized: Goal does not belong to user");
    }

    Step step = stepRepository.findById(stepId)
        .orElseThrow(() -> new RuntimeException("Step not found"));

    // Verify the step belongs to the goal
    if (!step.getGoal().getId().equals(goalId)) {
      throw new RuntimeException("Step does not belong to this goal");
    }

    step.setIsCompleted(completed);
    
    // Set completedAt when marking as completed
    if (completed && step.getCompletedAt() == null) {
      step.setCompletedAt(LocalDateTime.now());
    }
    // Clear completedAt when marking as not completed
    if (!completed) {
      step.setCompletedAt(null);
    }

    Step updatedStep = stepRepository.save(step);
    return StepResponse.from(updatedStep);
  }

  public void deleteStep(UUID goalId, UUID stepId) {
    // Get the authenticated user ID from SecurityContext
    UUID userId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    Goal goal = goalRepository.findById(goalId)
        .orElseThrow(() -> new RuntimeException("Goal not found"));

    // Check if the goal belongs to the authenticated user
    if (!goal.getUser().getId().equals(userId)) {
      throw new RuntimeException("Unauthorized: Goal does not belong to user");
    }

    Step step = stepRepository.findById(stepId)
        .orElseThrow(() -> new RuntimeException("Step not found"));

    // Verify the step belongs to the goal
    if (!step.getGoal().getId().equals(goalId)) {
      throw new RuntimeException("Step does not belong to this goal");
    }

    Integer deletedPosition = step.getPosition();

    // Delete the step
    stepRepository.delete(step);

    // Reorder remaining steps - decrement position for steps after deleted one
    List<Step> remainingSteps = stepRepository.findByGoalIdOrderByPositionAsc(goalId);
    for (Step s : remainingSteps) {
      if (s.getPosition() > deletedPosition) {
        s.setPosition(s.getPosition() - 1);
        stepRepository.save(s);
      }
    }
  }

}
