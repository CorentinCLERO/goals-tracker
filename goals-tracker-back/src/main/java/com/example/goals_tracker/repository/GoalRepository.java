package com.example.goals_tracker.repository;


import com.example.goals_tracker.model.Goal;
import com.example.goals_tracker.model.StatusEnum;
import com.example.goals_tracker.model.PriorityEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GoalRepository extends JpaRepository<Goal, UUID> {
    List<Goal> findByUserId(UUID userId);
    
    @Query("SELECT g FROM Goal g WHERE g.user.id = :userId " +
           "AND (:status IS NULL OR g.status = :status) " +
           "AND (:priority IS NULL OR g.priority = :priority) " +
           "ORDER BY " +
           "CASE WHEN :sortBy = 'deadline' AND :sortDirection = 'asc' THEN g.deadline END ASC, " +
           "CASE WHEN :sortBy = 'deadline' AND :sortDirection = 'desc' THEN g.deadline END DESC, " +
           "CASE WHEN :sortBy = 'createdAt' AND :sortDirection = 'asc' THEN g.createdAt END ASC, " +
           "CASE WHEN :sortBy = 'createdAt' AND :sortDirection = 'desc' THEN g.createdAt END DESC, " +
           "CASE WHEN :sortBy = 'priority' AND :sortDirection = 'asc' THEN g.priority END ASC, " +
           "CASE WHEN :sortBy = 'priority' AND :sortDirection = 'desc' THEN g.priority END DESC")
    List<Goal> findByUserIdWithFiltersAndSorting(
            @Param("userId") UUID userId,
            @Param("status") StatusEnum status,
            @Param("priority") PriorityEnum priority,
            @Param("sortBy") String sortBy,
            @Param("sortDirection") String sortDirection);
}
