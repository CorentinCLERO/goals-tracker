
package com.example.goals_tracker.dto;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HabitLogResponse {
    private UUID id;
    private LocalDate date;
    private Boolean isCompleted;
    private String notes;
}