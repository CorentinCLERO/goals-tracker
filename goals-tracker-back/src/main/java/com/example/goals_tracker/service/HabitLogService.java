package com.example.goals_tracker.service;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.goals_tracker.dto.HabitLogResponse;
import com.example.goals_tracker.dto.HabitStatsResponse;
import com.example.goals_tracker.exception.BeanNotFoundException;
import com.example.goals_tracker.model.Habit;
import com.example.goals_tracker.model.HabitLog;
import com.example.goals_tracker.repository.HabitLogRepository;
import com.example.goals_tracker.repository.HabitRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HabitLogService {

    private final HabitLogRepository habitLogRepository;
    private final HabitRepository habitRepository;
    private final XpService xpService;

    @Transactional
    public HabitLogResponse logHabit(UUID habitId, UUID userId, LocalDate date, String notes) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new BeanNotFoundException("Habitude non trouvée"));

        if (!habit.getUser().getId().equals(userId)) throw new BeanNotFoundException("Accès refusé");
        
        HabitLog log = habitLogRepository.findByHabitIdAndDate(habitId, date)
                .orElse(HabitLog.builder().habit(habit).date(date).build());
        
        log.setIsCompleted(true);
        log.setNotes(notes);
        xpService.addXpToUser(userId, XpService.XP_COMPLETE_HABIT);
        
        return mapToResponse(habitLogRepository.save(log));
    }

    private HabitLogResponse mapToResponse(HabitLog log) {
        return HabitLogResponse.builder()
                .id(log.getId()).date(log.getDate())
                .isCompleted(log.getIsCompleted()).notes(log.getNotes()).build();
    }

    @Transactional(readOnly = true)
    public List<HabitLogResponse> getLogs(UUID habitId, UUID userId, LocalDate start, LocalDate end) {
        Habit habit = habitRepository.findById(habitId).orElseThrow(() -> new BeanNotFoundException("Habitude non trouvée"));

        if (!habit.getUser().getId().equals(userId)) throw new BeanNotFoundException("Accès refusé");
        
        // If no dates provided, return all logs
        if (start == null && end == null) {
            return habitLogRepository.findAllByHabitIdOrderByDateDesc(habitId)
                    .stream().map(this::mapToResponse).toList();
        }
        
        // If only start date provided, use it as both start and end
        if (end == null) {
            end = start;
        }
        
        // If only end date provided, use habit start date as start
        if (start == null) {
            start = habit.getStartDate();
        }
        
        return habitLogRepository.findAllByHabitIdAndDateBetweenOrderByDateDesc(habitId, start, end)
                .stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public void deleteLogByDate(UUID habitId, UUID userId, LocalDate date) {
        Habit habit = habitRepository.findById(habitId).orElseThrow(() -> new BeanNotFoundException("Habitude non trouvée"));

        if (!habit.getUser().getId().equals(userId)) throw new BeanNotFoundException("Accès refusé");

        habitLogRepository.deleteByHabitIdAndDate(habitId, date);
    }

    @Transactional(readOnly = true)
    public HabitStatsResponse getStats(UUID habitId, UUID userId) {
        List<HabitLog> allLogs = habitLogRepository.findAllByHabitIdOrderByDateDesc(habitId);
        
        return HabitStatsResponse.builder()
                .currentStreak(calculateStreak(allLogs))
                .longestStreak(calculateLongestStreak(allLogs))
                .completionRate(calculateCompletionRate(allLogs, habitId))
                .totalCompleted(allLogs.stream().filter(HabitLog::getIsCompleted).count())
                .build();
    }

    private int calculateLongestStreak(List<HabitLog> logs) {
        if (logs.isEmpty()) return 0;

        int longest = 0;
        int currentCount = 0;
        LocalDate nextExpectedDate = null;

        for (HabitLog log : logs) {
            if (!log.getIsCompleted()) {
                currentCount = 0;
                nextExpectedDate = null;
                continue;
            }

            if (nextExpectedDate == null || log.getDate().equals(nextExpectedDate)) {
                currentCount++;
                nextExpectedDate = log.getDate().minusDays(1);
            } else {
                currentCount = 1;
                nextExpectedDate = log.getDate().minusDays(1);
            }

            if (currentCount > longest) {
                longest = currentCount;
            }
        }
        return longest;
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

    private double calculateCompletionRate(List<HabitLog> logs, UUID habitId) {
        Habit habit = habitRepository.findById(habitId).orElseThrow();
        long daysSinceStart = java.time.temporal.ChronoUnit.DAYS.between(habit.getStartDate(), LocalDate.now()) + 1;
        long completed = logs.stream().filter(HabitLog::getIsCompleted).count();
        
        return (double) completed / daysSinceStart * 100;
    }
   
}