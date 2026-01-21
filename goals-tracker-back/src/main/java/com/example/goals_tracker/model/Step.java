package com.example.goals_tracker.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "steps")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Step {
  @Id
  @GeneratedValue
  private UUID id;

  @Column(nullable = false)
  @NotBlank(message = "Title is required")
  private String title;

  @JoinColumn(nullable = false)
  private LocalDateTime deadline;

  @Column(name = "order_by")
  @JoinColumn(nullable = false)
  private Integer orderBy;

  @Builder.Default
  @Column(name = "is_completed")
  private Boolean isCompleted = false;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "goal_id", nullable = false)
  private Goal goal;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "completed_at")
  private LocalDateTime completedAt;
}
