package com.example.goals_tracker.repository;

import java.util.UUID;
import java.util.List;

import com.example.goals_tracker.model.Step;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StepRepository extends JpaRepository<Step, UUID> {
  List<Step> findByGoalIdOrderByPositionAsc(UUID goalId);
  
  long countByGoalId(UUID goalId);
  
  long countByGoalIdAndIsCompletedTrue(UUID goalId);
}
