package com.example.goals_tracker.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.goals_tracker.dto.DashboardResponse;
import com.example.goals_tracker.service.StatsService;
import com.example.goals_tracker.dto.GlobalStatsResponse;
import com.example.goals_tracker.dto.HabitStatsResponse;

import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(statsService.getDashboardData(userId));
    }

    @GetMapping("/stats")
    public ResponseEntity<GlobalStatsResponse> getGlobalStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();

        return ResponseEntity.ok(statsService.getGlobalStats(userId));
    }

    @GetMapping("/stats/goals")
    public ResponseEntity<Map<String, Long>> getGoalsStatsByCategory() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();

        return ResponseEntity.ok(statsService.getGoalsStatsByCategory(userId));
    }
    @GetMapping("/stats/habits")
    public ResponseEntity<List<HabitStatsResponse>> getHabitStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();

        return ResponseEntity.ok(statsService.getHabitStats(userId));
}
}