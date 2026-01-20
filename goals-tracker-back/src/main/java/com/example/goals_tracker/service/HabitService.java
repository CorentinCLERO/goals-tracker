package com.example.goals_tracker.service;
import com.example.goals_tracker.dto.HabitRequest;
import com.example.goals_tracker.dto.HabitResponse;
import com.example.goals_tracker.model.Habit;
import com.example.goals_tracker.model.User;
import com.example.goals_tracker.repository.HabitRepository;
import com.example.goals_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final UserRepository userRepository;

    @Transactional
    public HabitResponse createHabit(UUID userId, HabitRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Habit habit = Habit.builder()
                .name(request.getName())
                .description(request.getDescription())
                .frequency(request.getFrequency())
                .weeklyTarget(request.getWeeklyTarget())
                .category(request.getCategory())
                .startDate(request.getStartDate() != null ? request.getStartDate() : java.time.LocalDate.now())
                .user(user)
                .isArchived(false)
                .build();

        Habit savedHabit = habitRepository.save(habit);

        return mapToResponse(savedHabit);
    }

    private HabitResponse mapToResponse(Habit habit) {
        return HabitResponse.builder()
                .id(habit.getId())
                .name(habit.getName())
                .description(habit.getDescription())
                .frequency(habit.getFrequency())
                .startDate(habit.getStartDate())
                .isArchived(habit.getIsArchived())
                .created_at(habit.getCreatedAt())
                .updated_at(habit.getUpdatedAt())
                .build();
    }
}