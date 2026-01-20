package com.example.goals_tracker.dto;

import com.example.goals_tracker.model.Goal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GoalResponse {
    private String id;
    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;
    private String startDate;
    private String deadline;

    public static GoalResponse from(Goal goal) {
        return GoalResponse.builder()
                .id(goal.getId().toString())
                .title(goal.getTitle())
                .description(goal.getDescription())
                .category(goal.getCategory())
                .priority(goal.getPriority().name())
                .status(goal.getStatus().name())
                .startDate(goal.getStartDate().toString())
                .deadline(goal.getDeadline().toString())
                .build();
    }
}
