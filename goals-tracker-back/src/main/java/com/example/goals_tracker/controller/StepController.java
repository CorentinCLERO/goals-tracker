package com.example.goals_tracker.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.goals_tracker.dto.StepRequest;
import com.example.goals_tracker.dto.StepResponse;
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
}
