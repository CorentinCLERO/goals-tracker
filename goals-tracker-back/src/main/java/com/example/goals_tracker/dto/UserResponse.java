package com.example.goals_tracker.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {
    
    private UUID id;
    private String email;
    private String name;
    private Integer level;
    private Integer xpPoints;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}