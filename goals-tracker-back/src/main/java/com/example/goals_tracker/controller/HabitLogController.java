package com.example.goals_tracker.controller;

import java.util.UUID;
import java.time.LocalDate; 
import java.util.List;       
import org.springframework.web.bind.annotation.GetMapping;    
import org.springframework.web.bind.annotation.RequestParam;  
import org.springframework.format.annotation.DateTimeFormat;  
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.goals_tracker.dto.HabitLogRequest;
import com.example.goals_tracker.dto.HabitLogResponse;
import com.example.goals_tracker.dto.HabitStatsResponse;
import com.example.goals_tracker.service.HabitLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitLogController {

    private final HabitLogService habitLogService;

    @PostMapping("/{id}/log")
    public ResponseEntity<HabitLogResponse> log(
            @PathVariable UUID id,
            @RequestBody(required = false) HabitLogRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();
        
        LocalDate date = (request != null && request.getDate() != null) 
            ? request.getDate() 
            : LocalDate.now();
        String notes = (request != null) ? request.getNotes() : null;
        
        return ResponseEntity.ok(habitLogService.logHabit(id, userId, date, notes));
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<List<HabitLogResponse>> getLogs(
            @PathVariable("id") UUID id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start_date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end_date) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(habitLogService.getLogs(id, userId, start_date, end_date));
    }

    @DeleteMapping("/{id}/log/{date}")
    public ResponseEntity<Void> deleteLog(
            @PathVariable UUID id,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();
        habitLogService.deleteLogByDate(id, userId, date);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<HabitStatsResponse> getStats(
            @PathVariable UUID id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(habitLogService.getStats(id, userId));
    }
}