package com.example.goals_tracker.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserBadgeId implements Serializable {
    private UUID userId;
    private UUID badgeId;
}