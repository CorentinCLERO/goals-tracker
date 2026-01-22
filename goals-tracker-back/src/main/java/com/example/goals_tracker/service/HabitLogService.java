package com.example.goals_tracker.service;
import java.time.LocalDate;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.goals_tracker.dto.HabitLogResponse;
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

    @Transactional
    public HabitLogResponse logHabitToday(UUID habitId, UUID userId, String notes) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new BeanNotFoundException("Habitude non trouvée"));

        if (!habit.getUser().getId().equals(userId)) throw new BeanNotFoundException("Accès refusé");

        LocalDate today = LocalDate.now();
        
        HabitLog log = habitLogRepository.findByHabitIdAndDate(habitId, today)
                .orElse(HabitLog.builder().habit(habit).date(today).build());
        
        log.setIsCompleted(true);
        log.setNotes(notes);
        
        return mapToResponse(habitLogRepository.save(log));
    }

    private HabitLogResponse mapToResponse(HabitLog log) {
        return HabitLogResponse.builder()
                .id(log.getId()).date(log.getDate())
                .isCompleted(log.getIsCompleted()).notes(log.getNotes()).build();
    }

   
}