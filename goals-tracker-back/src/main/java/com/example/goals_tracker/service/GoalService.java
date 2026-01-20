package com.example.goals_tracker.service;

import com.example.goals_tracker.dto.GoalRequest;
import com.example.goals_tracker.dto.GoalResponse;
import com.example.goals_tracker.dto.GoalsQueryParams;
import com.example.goals_tracker.model.Goal;
import com.example.goals_tracker.model.PriorityEnum;
import com.example.goals_tracker.model.StatusEnum;
import com.example.goals_tracker.model.User;
import com.example.goals_tracker.repository.GoalRepository;
import com.example.goals_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoalService {
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalResponse createGoal(GoalRequest goalRequest, UUID userId) {
        PriorityEnum priorityEnum = PriorityEnum.valueOf(goalRequest.getPriority().toUpperCase());
        StatusEnum statusEnum = StatusEnum.valueOf(goalRequest.getStatus().toUpperCase());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Goal goal = Goal.builder()
                .title(goalRequest.getTitle())
                .description(goalRequest.getDescription())
                .category(goalRequest.getCategory())
                .priority(priorityEnum)
                .status(statusEnum)
                .startDate(LocalDateTime.parse(goalRequest.getStartDate()))
                .deadline(LocalDateTime.parse(goalRequest.getDeadline()))
                .user(user)
                .build();

        Goal newGoal = goalRepository.save(goal);

        return GoalResponse.from(newGoal);
    }

    public List<GoalResponse> listUserGoals(UUID userId, GoalsQueryParams queryParams) {
        List<Goal> goals = goalRepository.findByUserIdWithFiltersAndSorting(
                userId, queryParams.getStatus(), queryParams.getPriority(), 
                queryParams.getSortBy(), queryParams.getSortDirection());
        return goals.stream()
                .map(GoalResponse::from)
                .toList();
    }
}
