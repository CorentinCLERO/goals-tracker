package com.example.goals_tracker.repository;

import java.util.UUID;

import com.example.goals_tracker.model.Step;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StepRepository extends JpaRepository<Step, UUID> {
}
