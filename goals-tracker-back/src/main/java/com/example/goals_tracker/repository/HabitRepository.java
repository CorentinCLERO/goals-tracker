package com.example.goals_tracker.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.goals_tracker.model.Habit;

@Repository
public interface HabitRepository extends JpaRepository<Habit, UUID> {
    
    List<Habit> findAllByUserId(UUID userId);
    List<Habit> findAllByUserIdAndIsArchivedFalse(UUID userId);
}