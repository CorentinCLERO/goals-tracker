package com.example.goals_tracker.service;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.goals_tracker.dto.DashboardResponse;
import com.example.goals_tracker.dto.HabitToday;
import com.example.goals_tracker.model.HabitLog;
import com.example.goals_tracker.model.StatusEnum;


import com.example.goals_tracker.repository.GoalRepository;
import com.example.goals_tracker.repository.HabitLogRepository;
import com.example.goals_tracker.repository.HabitRepository;
import com.example.goals_tracker.dto.GlobalStatsResponse;
import com.example.goals_tracker.model.Goal;

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

    public GlobalStatsResponse getGlobalStats(UUID userId) {
        long completedGoals = goalRepository.countByUserIdAndStatus(userId, StatusEnum.COMPLETED);

        long totalLogs = habitLogRepository.countByHabitUserId(userId);

        int recordStreak = habitRepository.findAllByUserIdAndIsArchivedFalse(userId).stream()
                .mapToInt(habit -> calculateLongestStreak(habitLogRepository.findAllByHabitIdOrderByDateDesc(habit.getId())))
                .max()
                .orElse(0);

        return GlobalStatsResponse.builder()
                .totalGoalsCompleted(completedGoals)
                .totalHabitLogs(totalLogs)
                .longestStreakRecord(recordStreak)
                .totalXP(calculateTotalXP(userId)) 
                .build();
    }

    private int calculateLongestStreak(List<HabitLog> logs) {
        int longest = 0;
        int current = 0;
        LocalDate nextExpected = null;

        for (HabitLog log : logs) {
            if (log.getIsCompleted()) {
                if (nextExpected == null || log.getDate().equals(nextExpected)) {
                    current++;
                } else {
                    current = 1;
                }
                nextExpected = log.getDate().minusDays(1);
                longest = Math.max(longest, current);
            } else {
                current = 0;
                nextExpected = null;
            }
        }
        return longest;
    }

    private int calculateTotalXP(UUID userId) {
        long habitXP = habitLogRepository.countByHabitUserId(userId) * 5;
        long goalXP = goalRepository.countByUserIdAndStatus(userId, StatusEnum.COMPLETED) * 50;
        return (int) (habitXP + goalXP);
    }

    public Map<String, Long> getGoalsStatsByCategory(UUID userId) {
        List<Goal> allGoals = goalRepository.findByUserId(userId);
        
        return allGoals.stream()
                .filter(goal -> goal.getCategory() != null)
                .collect(Collectors.groupingBy(
                        Goal::getCategory, 
                        Collectors.counting()
                ));
    }
    
}