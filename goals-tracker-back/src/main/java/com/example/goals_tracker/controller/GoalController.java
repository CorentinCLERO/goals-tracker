package com.example.goals_tracker.controller;

import com.example.goals_tracker.dto.GoalRequest;
import com.example.goals_tracker.dto.GoalResponse;
import com.example.goals_tracker.dto.GoalsQueryParams;
import com.example.goals_tracker.service.GoalService;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
@Slf4j
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalResponse> createUserGoals(@Valid @RequestBody GoalRequest goalRequest) {
        log.info("Creating a new goal with title: {}", goalRequest.getTitle());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();

        GoalResponse createdGoal = goalService.createGoal(goalRequest, userId);
        log.info("Goal created successfully with ID: {}", createdGoal.getId());
        return ResponseEntity.status(201).body(createdGoal);
    }

    @GetMapping
    public ResponseEntity<List<GoalResponse>> listUserGoals(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(defaultValue = "deadline") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        log.info("Listing goals for the current user with filters - status: {}, priority: {}, sortBy: {}, sortDirection: {}",
                status, priority, sortBy, sortDirection);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();

        GoalsQueryParams queryParams = GoalsQueryParams.from(status, priority, sortBy, sortDirection);
        List<GoalResponse> goals = goalService.listUserGoals(userId, queryParams);
        log.info("Found {} goals for user ID: {}", goals.size(), userId);
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalResponse> getGoalById(@PathVariable("id") UUID id) {
        log.info("Fetching goal with ID: {}", id);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();

        GoalResponse goal = goalService.getGoalById(id, userId);
        log.info("Goal fetched successfully with ID: {}", goal.getId());
        return ResponseEntity.ok(goal);
    }
}
