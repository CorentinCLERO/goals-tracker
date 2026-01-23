package com.example.goals_tracker.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.goals_tracker.dto.StepRequest;
import com.example.goals_tracker.dto.StepResponse;
import com.example.goals_tracker.dto.UpdateStepRequest;
import com.example.goals_tracker.service.StepService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/goals/{id}/steps")
@RequiredArgsConstructor
@Slf4j
public class StepController {
  
  private final StepService stepService;

  @PostMapping
  public ResponseEntity<StepResponse> createGoalStep(@Valid @RequestBody StepRequest stepRequest, @PathVariable("id") UUID goalId) {
    log.info("Creating a new step with title: {}", stepRequest.getTitle());
    
    StepResponse createdStep = stepService.createStep(stepRequest, goalId);
    log.info("Step created successfully with ID: {}", createdStep.getId());
    return ResponseEntity.status(201).body(createdStep);
  }

  @GetMapping
  public ResponseEntity<List<StepResponse>> listGoalSteps(@PathVariable("id") UUID goalId) {
    List<StepResponse> goalSteps = stepService.listGoalSteps(goalId);

    return ResponseEntity.status(200).body(goalSteps);
  }

  @PatchMapping("/{stepId}")
  public ResponseEntity<StepResponse> updateStep(
      @PathVariable("id") UUID goalId,
      @PathVariable("stepId") UUID stepId,
      @Valid @RequestBody UpdateStepRequest updateRequest) {
    log.info("Updating step {} in goal {}", stepId, goalId);
    
    StepResponse updatedStep = stepService.updateStep(goalId, stepId, updateRequest);
    log.info("Successfully updated step {}", stepId);
    
    return ResponseEntity.ok(updatedStep);
  }

  @PatchMapping("/{stepId}/complete")
  public ResponseEntity<StepResponse> completeStep(
      @PathVariable("id") UUID goalId,
      @PathVariable("stepId") UUID stepId) {
    log.info("Marking step {} as completed in goal {}", stepId, goalId);
    
    StepResponse updatedStep = stepService.completeStep(goalId, stepId, true);
    log.info("Successfully marked step {} as completed", stepId);
    
    return ResponseEntity.ok(updatedStep);
  }

  @PatchMapping("/{stepId}/uncomplete")
  public ResponseEntity<StepResponse> uncompleteStep(
      @PathVariable("id") UUID goalId,
      @PathVariable("stepId") UUID stepId) {
    log.info("Marking step {} as not completed in goal {}", stepId, goalId);
    
    StepResponse updatedStep = stepService.completeStep(goalId, stepId, false);
    log.info("Successfully marked step {} as not completed", stepId);
    
    return ResponseEntity.ok(updatedStep);
  }

  @DeleteMapping("/{stepId}")
  public ResponseEntity<Void> deleteStep(
      @PathVariable("id") UUID goalId,
      @PathVariable("stepId") UUID stepId) {
    log.info("Deleting step {} from goal {}", stepId, goalId);
    
    stepService.deleteStep(goalId, stepId);
    log.info("Successfully deleted step {}", stepId);
    
    return ResponseEntity.noContent().build();
  }
}
