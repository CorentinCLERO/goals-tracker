package com.example.goals_tracker.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.example.goals_tracker.model.HabitLog;

public interface HabitLogRepository extends JpaRepository<HabitLog, UUID>{
    Optional<HabitLog> findByHabitIdAndDate(UUID habitId, LocalDate date);
    List<HabitLog> findAllByHabitIdAndDateBetweenOrderByDateDesc(UUID habitId, LocalDate start, LocalDate end);
    void deleteByHabitIdAndDate(UUID habitId, LocalDate date);
    List<HabitLog> findAllByHabitIdOrderByDateDesc(UUID habitId);
    boolean existsByHabitIdAndDateAndIsCompleted(UUID habitId, LocalDate date, Boolean isCompleted);
    
    @Query("SELECT COUNT(l) FROM HabitLog l WHERE l.habit.user.id = :userId AND l.isCompleted = true")
    long countByHabitUserId(@Param("userId") UUID userId);
}
