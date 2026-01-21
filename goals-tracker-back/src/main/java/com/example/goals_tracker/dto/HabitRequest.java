package com.example.goals_tracker.dto;

import com.example.goals_tracker.model.Frequency;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HabitRequest {

    @NotBlank(message = "Le nom de l'habitude est obligatoire")
    private String name;

    private String description;

    @NotNull(message = "La fréquence (daily ou weekly) est obligatoire")
    private Frequency frequency;

    @Min(value = 1, message = "L'objectif hebdomadaire doit être d'au moins 1")
    private Integer weeklyTarget;

    private String category;

    private LocalDate startDate;
}