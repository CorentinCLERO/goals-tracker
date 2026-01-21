package com.example.goals_tracker.controller;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.goals_tracker.dto.HabitRequest;
import com.example.goals_tracker.dto.HabitResponse;
import com.example.goals_tracker.service.HabitService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    @PostMapping("/habits")
    public ResponseEntity<HabitResponse> createHabit(

        @Valid @RequestBody HabitRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();    

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        System.out.println("Création d'habitude pour l'utilisateur connecté : " + userId);
        HabitResponse response = habitService.createHabit(userId, request);
        System.out.println("Requête de création d'habitude reçue !");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/habits/{id}")
    public ResponseEntity<HabitResponse> updateHabit(
        @PathVariable UUID id, 
        @Valid @RequestBody HabitRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();    
    
        HabitResponse response = habitService.updateHabit(id, userId, request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/habits")
    public ResponseEntity<List<HabitResponse>> getHabits() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        System.out.println("le user lancé " + userId);

        List<HabitResponse> response = habitService.getListHabit(userId);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/habits/{id}/archive")
    public ResponseEntity<Void> archiveHabit(
        @PathVariable UUID id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) auth.getPrincipal();
        habitService.archiveHabit(id, userId);
        System.out.println("Habitude archivée : " + id + " par l'utilisateur : " + userId);
    
        return ResponseEntity.noContent().build();
        }
}