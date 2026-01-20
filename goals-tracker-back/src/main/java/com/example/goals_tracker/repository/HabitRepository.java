package com.example.goals_tracker.repository;

import com.example.goals_tracker.model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface HabitRepository extends JpaRepository<Habit, UUID> {
}