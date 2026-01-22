package com.example.goals_tracker.service;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.goals_tracker.dto.DashboardResponse;
import com.example.goals_tracker.dto.HabitToday;
import com.example.goals_tracker.model.HabitLog;
import com.example.goals_tracker.model.StatusEnum;


import com.example.goals_tracker.repository.GoalRepository;
import com.example.goals_tracker.repository.HabitLogRepository;
import com.example.goals_tracker.repository.HabitRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class StatsService {
    private final GoalRepository goalRepository;
    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;

    public DashboardResponse getDashboardData(UUID userId) {
        var today = LocalDate.now();

        long activeGoals;
        activeGoals = goalRepository.countByUserIdAndStatus(userId, StatusEnum.ACTIVE);

        List<HabitToday> todayHabits;
        todayHabits = habitRepository.findAllByUserIdAndIsArchivedFalse(userId)
                .stream()
                .map(habit -> {
                    boolean completed = habitLogRepository.findByHabitIdAndDate(habit.getId(), today).isPresent();
                    return HabitToday.builder()
                            .name(habit.getName())
                            .isCompletedToday(completed)
                            .currentStreak(calculateStreak(habitLogRepository.findAllByHabitIdOrderByDateDesc(habit.getId())))
                            .build();
                }).toList();

        return DashboardResponse.builder()
                .activeGoalsCount(activeGoals)
                .habitsToday(todayHabits)
                .habitsCompletedTodayCount(todayHabits.stream().filter(HabitToday::isCompletedToday).count())
                .build();
    }
    private int calculateStreak(List<HabitLog> logs) {
        int streak = 0;
        LocalDate expectedDate = LocalDate.now();
        
        for (HabitLog log : logs) {
            if (log.getDate().equals(expectedDate) && log.getIsCompleted()) {
                streak++;
                expectedDate = expectedDate.minusDays(1);
            } else if (log.getDate().isBefore(expectedDate)) {
                break; 
            }
        }
        return streak;
    }
    
}