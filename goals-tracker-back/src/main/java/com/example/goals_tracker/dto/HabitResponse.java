package com.example.goals_tracker.dto;
import com.example.goals_tracker.model.Frequency;
import com.example.goals_tracker.model.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.Builder;

import java.time.LocalDate; 
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HabitResponse {
    
    private UUID id;
    private String name;
    private String description;
    private Frequency frequency;
    private Integer weeklyTarget;
    private String category;
    private Integer xpPoints;
    private LocalDate startDate;
    private Boolean isArchived;
    private User user;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
}