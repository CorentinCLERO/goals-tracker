package com.example.goals_tracker.service;

import com.example.goals_tracker.dto.GoalRequest;
import com.example.goals_tracker.dto.GoalResponse;
import com.example.goals_tracker.dto.GoalsQueryParams;
import com.example.goals_tracker.exception.BeanNotFoundException;
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

import static com.example.goals_tracker.dto.GoalsQueryParams.parsePriority;
import static com.example.goals_tracker.dto.GoalsQueryParams.parseStatus;

@Service
@RequiredArgsConstructor
public class GoalService {
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalResponse createGoal(GoalRequest goalRequest, UUID userId) {
        PriorityEnum priorityEnum = parsePriority(goalRequest.getPriority());
        StatusEnum statusEnum = parseStatus(goalRequest.getStatus());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BeanNotFoundException("User not found"));

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

    public GoalResponse getGoalById(UUID goalId, UUID userId) {
        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new BeanNotFoundException("Goal not found"));
        return GoalResponse.from(goal);
    }

    public GoalResponse updateGoal(UUID goalId, GoalRequest goalRequest, UUID userId) {
        Goal existingGoal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new BeanNotFoundException("Goal not found"));
        mapFields(goalRequest, existingGoal);
        Goal updatedGoal = goalRepository.save(existingGoal);
        return GoalResponse.from(updatedGoal);
    }

    private void mapFields(GoalRequest request, Goal existingGoal) {
            existingGoal.setTitle(request.getTitle());
            existingGoal.setDescription(request.getDescription());
            existingGoal.setCategory(request.getCategory());
            PriorityEnum priorityEnum = parsePriority(request.getPriority());
            StatusEnum statusEnum = parseStatus(request.getStatus());
            existingGoal.setPriority(priorityEnum);
            existingGoal.setStatus(statusEnum);
            existingGoal.setStartDate(LocalDateTime.parse(request.getStartDate()));
            existingGoal.setDeadline(LocalDateTime.parse(request.getDeadline()));
    }

    public void deleteGoal(UUID goalId, UUID userId) {
        Goal existingGoal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new BeanNotFoundException("Goal not found"));
        goalRepository.delete(existingGoal);
    }
}
