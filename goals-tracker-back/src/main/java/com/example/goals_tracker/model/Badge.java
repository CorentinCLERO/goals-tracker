package com.example.goals_tracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.UUID;

@Entity
@Table(name = "badges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Badge {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @Column(unique = true, nullable = false)
    @NotBlank(message = "Badge name is required")
    private String name;
    
    private String description;
    
    private String icon;
    
    private String criteria;
}