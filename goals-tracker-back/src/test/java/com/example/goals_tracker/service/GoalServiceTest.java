package com.example.goals_tracker.service;

import com.example.goals_tracker.dto.GoalRequest;
import com.example.goals_tracker.dto.GoalResponse;
import com.example.goals_tracker.dto.GoalProgressResponse;
import com.example.goals_tracker.dto.GoalsQueryParams;
import com.example.goals_tracker.exception.BeanNotFoundException;
import com.example.goals_tracker.model.Goal;
import com.example.goals_tracker.model.PriorityEnum;
import com.example.goals_tracker.model.StatusEnum;
import com.example.goals_tracker.model.User;
import com.example.goals_tracker.repository.GoalRepository;
import com.example.goals_tracker.repository.StepRepository;
import com.example.goals_tracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GoalServiceTest {

    @InjectMocks
    private GoalService goalService;

    @Mock
    private GoalRepository goalRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private StepRepository stepRepository;

    private UUID userId;
    private UUID goalId;
    private User mockUser;
    private Goal mockGoal;
    private GoalRequest validGoalRequest;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        goalId = UUID.randomUUID();

        mockUser = User.builder()
                .id(userId)
                .email("test@example.com")
                .name("Test User")
                .build();

        mockGoal = Goal.builder()
                .id(goalId)
                .title("Test Goal")
                .description("Test Description")
                .category("Health")
                .priority(PriorityEnum.HIGH)
                .status(StatusEnum.ACTIVE)
                .startDate(LocalDateTime.of(2024, 1, 1, 0, 0))
                .deadline(LocalDateTime.of(2024, 12, 31, 23, 59))
                .user(mockUser)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        validGoalRequest = GoalRequest.builder()
                .title("Test Goal")
                .description("Test Description")
                .category("Health")
                .priority("HIGH")
                .status("ACTIVE")
                .startDate("2024-01-01T00:00:00")
                .deadline("2024-12-31T23:59:59")
                .build();
    }

    @Test
    void testCreateGoal_Success() {
        // given
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(goalRepository.save(any(Goal.class))).thenReturn(mockGoal);

        // when
        GoalResponse actual = goalService.createGoal(validGoalRequest, userId);

        // then
        assertNotNull(actual);
        assertEquals("Test Goal", actual.getTitle());
        assertEquals("Test Description", actual.getDescription());
        assertEquals("Health", actual.getCategory());
        assertEquals("HIGH", actual.getPriority());
        assertEquals("ACTIVE", actual.getStatus());
        assertEquals("2024-01-01T00:00", actual.getStartDate());
        assertEquals("2024-12-31T23:59", actual.getDeadline());
        
        verify(userRepository).findById(userId);
        verify(goalRepository).save(any(Goal.class));
    }

    @Test
    void testCreateGoal_UserNotFound() {
        // given
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when & then
        assertThrows(BeanNotFoundException.class, () -> {
            goalService.createGoal(validGoalRequest, userId);
        });
        
        verify(userRepository).findById(userId);
        verify(goalRepository, never()).save(any(Goal.class));
    }

    @Test
    void testListUserGoals_Success() {
        // given
        Goal goal1 = Goal.builder()
                .id(UUID.randomUUID())
                .title("Goal 1")
                .description("Description 1")
                .category("Health")
                .priority(PriorityEnum.HIGH)
                .status(StatusEnum.ACTIVE)
                .startDate(LocalDateTime.now())
                .deadline(LocalDateTime.now().plusDays(30))
                .user(mockUser)
                .build();

        Goal goal2 = Goal.builder()
                .id(UUID.randomUUID())
                .title("Goal 2")
                .description("Description 2")
                .category("Career")
                .priority(PriorityEnum.MEDIUM)
                .status(StatusEnum.COMPLETED)
                .startDate(LocalDateTime.now())
                .deadline(LocalDateTime.now().plusDays(60))
                .user(mockUser)
                .build();

        List<Goal> mockGoals = Arrays.asList(goal1, goal2);
        GoalsQueryParams queryParams = GoalsQueryParams.builder()
                .status(null)
                .priority(null)
                .sortBy("deadline")
                .sortDirection("asc")
                .build();

        when(goalRepository.findByUserIdWithFiltersAndSorting(userId, null, null, "deadline", "asc"))
                .thenReturn(mockGoals);

        // when
        List<GoalResponse> actual = goalService.listUserGoals(userId, queryParams);

        // then
        assertNotNull(actual);
        assertEquals(2, actual.size());
        assertEquals("Goal 1", actual.get(0).getTitle());
        assertEquals("Goal 2", actual.get(1).getTitle());
        
        verify(goalRepository).findByUserIdWithFiltersAndSorting(userId, null, null, "deadline", "asc");
    }

    @Test
    void testGetGoalById_Success() {
        // given
        when(goalRepository.findByIdAndUserId(goalId, userId)).thenReturn(Optional.of(mockGoal));

        // when
        GoalResponse actual = goalService.getGoalById(goalId, userId);

        // then
        assertNotNull(actual);
        assertEquals("Test Goal", actual.getTitle());
        assertEquals("Test Description", actual.getDescription());
        assertEquals("Health", actual.getCategory());
        
        verify(goalRepository).findByIdAndUserId(goalId, userId);
    }

    @Test
    void testGetGoalById_NotFound() {
        // given
        when(goalRepository.findByIdAndUserId(goalId, userId)).thenReturn(Optional.empty());

        // when & then
        assertThrows(BeanNotFoundException.class, () -> {
            goalService.getGoalById(goalId, userId);
        });
        
        verify(goalRepository).findByIdAndUserId(goalId, userId);
    }

    @Test
    void testUpdateGoal_Success() {
        // given
        GoalRequest updateRequest = GoalRequest.builder()
                .title("Updated Goal")
                .description("Updated Description")
                .category("Career")
                .priority("MEDIUM")
                .status("ACTIVE")
                .startDate("2024-02-01T00:00:00")
                .deadline("2024-11-30T23:59:59")
                .build();

        Goal updatedGoal = Goal.builder()
                .id(goalId)
                .title("Updated Goal")
                .description("Updated Description")
                .category("Career")
                .priority(PriorityEnum.MEDIUM)
                .status(StatusEnum.ACTIVE)
                .startDate(LocalDateTime.of(2024, 2, 1, 0, 0))
                .deadline(LocalDateTime.of(2024, 11, 30, 23, 59))
                .user(mockUser)
                .build();

        when(goalRepository.findByIdAndUserId(goalId, userId)).thenReturn(Optional.of(mockGoal));
        when(goalRepository.save(any(Goal.class))).thenReturn(updatedGoal);

        // when
        GoalResponse actual = goalService.updateGoal(goalId, updateRequest, userId);

        // then
        assertNotNull(actual);
        assertEquals("Updated Goal", actual.getTitle());
        assertEquals("Updated Description", actual.getDescription());
        assertEquals("Career", actual.getCategory());
        assertEquals("MEDIUM", actual.getPriority());
        
        verify(goalRepository).findByIdAndUserId(goalId, userId);
        verify(goalRepository).save(any(Goal.class));
    }

    @Test
    void testUpdateGoal_NotFound() {
        // given
        when(goalRepository.findByIdAndUserId(goalId, userId)).thenReturn(Optional.empty());

        // when & then
        assertThrows(BeanNotFoundException.class, () -> {
            goalService.updateGoal(goalId, validGoalRequest, userId);
        });
        
        verify(goalRepository).findByIdAndUserId(goalId, userId);
        verify(goalRepository, never()).save(any(Goal.class));
    }

    @Test
    void testMarkGoalAsCompleted_Success() {
        // given
        Goal completedGoal = Goal.builder()
                .id(goalId)
                .title("Test Goal")
                .description("Test Description")
                .category("Health")
                .priority(PriorityEnum.HIGH)
                .status(StatusEnum.COMPLETED)
                .startDate(LocalDateTime.of(2024, 1, 1, 0, 0))
                .deadline(LocalDateTime.of(2024, 12, 31, 23, 59))
                .user(mockUser)
                .completedAt(LocalDateTime.now())
                .build();

        when(goalRepository.findByIdAndUserId(goalId, userId)).thenReturn(Optional.of(mockGoal));
        when(goalRepository.save(any(Goal.class))).thenReturn(completedGoal);

        // when
        GoalResponse actual = goalService.markGoalAsCompleted(goalId, userId);

        // then
        assertNotNull(actual);
        assertEquals("COMPLETED", actual.getStatus());
        
        verify(goalRepository).findByIdAndUserId(goalId, userId);
        verify(goalRepository).save(any(Goal.class));
    }

    @Test
    void testMarkGoalAsCompleted_NotFound() {
        // given
        when(goalRepository.findByIdAndUserId(goalId, userId)).thenReturn(Optional.empty());

        // when & then
        assertThrows(BeanNotFoundException.class, () -> {
            goalService.markGoalAsCompleted(goalId, userId);
        });
        
        verify(goalRepository).findByIdAndUserId(goalId, userId);
        verify(goalRepository, never()).save(any(Goal.class));
    }

    @Test
    void testDeleteGoal_Success() {
        // given
        when(goalRepository.findByIdAndUserId(goalId, userId)).thenReturn(Optional.of(mockGoal));

        // when
        goalService.deleteGoal(goalId, userId);

        // then
        verify(goalRepository).findByIdAndUserId(goalId, userId);
        verify(goalRepository).delete(mockGoal);
    }

    @Test
    void testDeleteGoal_NotFound() {
        // given
        when(goalRepository.findByIdAndUserId(goalId, userId)).thenReturn(Optional.empty());

        // when & then
        assertThrows(BeanNotFoundException.class, () -> {
            goalService.deleteGoal(goalId, userId);
        });
        
        verify(goalRepository).findByIdAndUserId(goalId, userId);
        verify(goalRepository, never()).delete(any(Goal.class));
    }

    @Test
    void testCalculateGoalProgress_WithSteps() {
        // given
        long totalSteps = 5L;
        long completedSteps = 3L;
        double expectedProgress = 60.0;

        when(goalRepository.findByIdAndUserId(goalId, userId)).thenReturn(Optional.of(mockGoal));
        when(stepRepository.countByGoalId(goalId)).thenReturn(totalSteps);
        when(stepRepository.countByGoalIdAndIsCompletedTrue(goalId)).thenReturn(completedSteps);

        // when
        GoalProgressResponse actual = goalService.calculateGoalProgress(goalId, userId);

        // then
        assertNotNull(actual);
        assertEquals(goalId, actual.getGoalId());
        assertEquals(expectedProgress, actual.getProgress());
        assertEquals(completedSteps, actual.getCompletedSteps());
        assertEquals(totalSteps, actual.getTotalSteps());
        
        verify(goalRepository).findByIdAndUserId(goalId, userId);
        verify(stepRepository).countByGoalId(goalId);
        verify(stepRepository).countByGoalIdAndIsCompletedTrue(goalId);
    }

    @Test
    void testCalculateGoalProgress_NoSteps() {
        // given
        long totalSteps = 0L;
        long completedSteps = 0L;
        double expectedProgress = 0.0;

        when(goalRepository.findByIdAndUserId(goalId, userId)).thenReturn(Optional.of(mockGoal));
        when(stepRepository.countByGoalId(goalId)).thenReturn(totalSteps);
        when(stepRepository.countByGoalIdAndIsCompletedTrue(goalId)).thenReturn(completedSteps);

        // when
        GoalProgressResponse actual = goalService.calculateGoalProgress(goalId, userId);

        // then
        assertNotNull(actual);
        assertEquals(goalId, actual.getGoalId());
        assertEquals(expectedProgress, actual.getProgress());
        assertEquals(completedSteps, actual.getCompletedSteps());
        assertEquals(totalSteps, actual.getTotalSteps());
        
        verify(goalRepository).findByIdAndUserId(goalId, userId);
        verify(stepRepository).countByGoalId(goalId);
        verify(stepRepository).countByGoalIdAndIsCompletedTrue(goalId);
    }

    @Test
    void testCalculateGoalProgress_GoalNotFound() {
        // given
        when(goalRepository.findByIdAndUserId(goalId, userId)).thenReturn(Optional.empty());

        // when & then
        assertThrows(BeanNotFoundException.class, () -> {
            goalService.calculateGoalProgress(goalId, userId);
        });
        
        verify(goalRepository).findByIdAndUserId(goalId, userId);
        verify(stepRepository, never()).countByGoalId(any(UUID.class));
        verify(stepRepository, never()).countByGoalIdAndIsCompletedTrue(any(UUID.class));
    }

    @Test
    void testCalculateGoalProgress_WithPrecisionRounding() {
        // given
        long totalSteps = 3L;
        long completedSteps = 1L;
        double expectedProgress = 33.33;

        when(goalRepository.findByIdAndUserId(goalId, userId)).thenReturn(Optional.of(mockGoal));
        when(stepRepository.countByGoalId(goalId)).thenReturn(totalSteps);
        when(stepRepository.countByGoalIdAndIsCompletedTrue(goalId)).thenReturn(completedSteps);

        // when
        GoalProgressResponse actual = goalService.calculateGoalProgress(goalId, userId);

        // then
        assertNotNull(actual);
        assertEquals(expectedProgress, actual.getProgress());
        
        verify(goalRepository).findByIdAndUserId(goalId, userId);
        verify(stepRepository).countByGoalId(goalId);
        verify(stepRepository).countByGoalIdAndIsCompletedTrue(goalId);
    }
}