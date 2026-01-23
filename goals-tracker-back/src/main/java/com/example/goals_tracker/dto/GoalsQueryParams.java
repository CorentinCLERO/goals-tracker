package com.example.goals_tracker.dto;

import com.example.goals_tracker.exception.InvalidEnumException;
import com.example.goals_tracker.model.PriorityEnum;
import com.example.goals_tracker.model.StatusEnum;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GoalsQueryParams {
    
    private final StatusEnum status;
    private final PriorityEnum priority;
    private final String sortBy;
    private final String sortDirection;

    public static GoalsQueryParams from(String status, String priority, String sortBy, String sortDirection) {
        return GoalsQueryParams.builder()
                .status(parseStatus(status))
                .priority(parsePriority(priority))
                .sortBy(validateSortBy(sortBy))
                .sortDirection(validateSortDirection(sortDirection))
                .build();
    }

    public static StatusEnum parseStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return null;
        }
        try {
            return StatusEnum.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidEnumException("status", status);
        }
    }

    public static PriorityEnum parsePriority(String priority) {
        if (priority == null || priority.trim().isEmpty()) {
            return null;
        }
        try {
            return PriorityEnum.valueOf(priority.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidEnumException("priority", priority);
        }
    }

    public static String validateSortBy(String sortBy) {
        if (sortBy == null || !java.util.List.of("deadline", "createdAt", "priority").contains(sortBy)) {
            return "deadline";
        }
        return sortBy;
    }

    public static String validateSortDirection(String sortDirection) {
        if (sortDirection == null || !java.util.List.of("asc", "desc").contains(sortDirection.toLowerCase())) {
            return "asc";
        }
        return sortDirection.toLowerCase();
    }
}