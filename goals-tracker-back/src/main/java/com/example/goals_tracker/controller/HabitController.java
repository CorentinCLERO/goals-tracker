package com.example.goals_tracker.controller;
import com.example.goals_tracker.dto.HabitRequest;
import com.example.goals_tracker.dto.HabitResponse;
import com.example.goals_tracker.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    @PostMapping("/habits")
    public ResponseEntity<HabitResponse> createHabit(

        @AuthenticationPrincipal UUID userId,
        @Valid @RequestBody HabitRequest request) {
        
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
        @AuthenticationPrincipal UUID userId,
        @Valid @RequestBody HabitRequest request) {
    
    HabitResponse response = habitService.updateHabit(id, userId, request);

    return ResponseEntity.ok(response);
}
}