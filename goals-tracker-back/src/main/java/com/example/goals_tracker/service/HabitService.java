package com.example.goals_tracker.service;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.goals_tracker.dto.HabitRequest;
import com.example.goals_tracker.dto.HabitResponse;
import com.example.goals_tracker.exception.BeanNotFoundException;
import com.example.goals_tracker.model.Habit;
import com.example.goals_tracker.model.User;
import com.example.goals_tracker.repository.HabitRepository;
import com.example.goals_tracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final UserRepository userRepository;

    @Transactional
    public HabitResponse createHabit(UUID userId, HabitRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new  BeanNotFoundException("User not found with id: " + userId));

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

    @Transactional
    public HabitResponse updateHabit(UUID habitId, UUID userId, HabitRequest request) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new  BeanNotFoundException("Habitude non trouvée"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new BeanNotFoundException("Vous n'avez pas l'autorisation de modifier cette habitude");
        }

        habit.setName(request.getName());
        habit.setDescription(request.getDescription());
        habit.setFrequency(request.getFrequency());
        habit.setWeeklyTarget(request.getWeeklyTarget());
        habit.setCategory(request.getCategory());

        if (request.getStartDate() != null) {
            habit.setStartDate(request.getStartDate());
        }

        Habit updatedHabit = habitRepository.save(habit);

        return mapToResponse(updatedHabit);
    }

    public List<HabitResponse> getListHabit(UUID userId) {
        List<Habit> habits = habitRepository.findAllByUserId(userId);
        System.out.println("Habitudes trouvées pour le user " + userId + " : " + habits.size());
    
        return habits.stream()
            .map(this::mapToResponse) 
            .toList();
    }
    @Transactional
    public void archiveHabit(UUID habitId, UUID userId) {
        Habit habit = habitRepository.findById(habitId)
            .orElseThrow(() -> new  BeanNotFoundException("Habitude non trouvée"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new  BeanNotFoundException("Accès refusé : ce n'est pas votre habitude");
        }
        habit.setIsArchived(true);
    
        habitRepository.save(habit);
    }

    @Transactional
    public void deleteHabit(UUID habitId, UUID userId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new  BeanNotFoundException("Habitude non trouvée"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new  BeanNotFoundException("Accès refusé : vous ne pouvez pas supprimer cette habitude");
        }
        habitRepository.delete(habit);
    }

    @Transactional(readOnly = true)
    public HabitResponse getHabitById(UUID habitId, UUID userId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new BeanNotFoundException("Habitude non trouvée avec l'id : " + habitId));

        if (!habit.getUser().getId().equals(userId)) {
            throw new BeanNotFoundException("Accès refusé : vous n'avez pas les droits sur cette habitude");
        }

        return mapToResponse(habit);
    }
}