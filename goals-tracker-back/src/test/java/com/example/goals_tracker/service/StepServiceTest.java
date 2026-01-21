package com.example.goals_tracker.service;

import com.example.goals_tracker.dto.StepRequest;
import com.example.goals_tracker.dto.StepResponse;
import com.example.goals_tracker.model.Goal;
import com.example.goals_tracker.model.Step;
import com.example.goals_tracker.model.User;
import com.example.goals_tracker.repository.GoalRepository;
import com.example.goals_tracker.repository.StepRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StepServiceTest {

    @InjectMocks
    private StepService stepService;

    @Mock
    private StepRepository stepRepository;

    @Mock
    private GoalRepository goalRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private UUID userId;
    private UUID goalId;
    private User mockUser;
    private Goal mockGoal;

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
                .user(mockUser)
                .build();

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userId);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testCreateStep_Success() {
        // given
        StepRequest request = StepRequest.builder()
                .title("Test Step")
                .deadline("2026-12-31T23:59:59")
                .position(1)
                .isCompleted(false)
                .build();

        Step mockStep = Step.builder()
                .id(UUID.randomUUID())
                .title("Test Step")
                .deadline(LocalDateTime.parse("2026-12-31T23:59:59"))
                .position(1)
                .isCompleted(false)
                .goal(mockGoal)
                .createdAt(LocalDateTime.now())
                .build();

        when(goalRepository.findById(goalId)).thenReturn(Optional.of(mockGoal));
        when(stepRepository.save(any(Step.class))).thenReturn(mockStep);

        // when
        StepResponse actual = stepService.createStep(request, goalId);

        // then
        assertNotNull(actual);
        assertEquals("Test Step", actual.getTitle());
        assertEquals(1, actual.getPosition());
        assertEquals(false, actual.getIsCompleted());
        assertNull(actual.getCompletedAt());
        assertNotNull(actual.getId());
        verify(goalRepository).findById(goalId);
        verify(stepRepository).save(any(Step.class));
    }

    @Test
    void testCreateStep_GoalNotFound() {
        // given
        StepRequest request = StepRequest.builder()
                .title("Test Step")
                .deadline("2026-12-31T23:59:59")
                .position(1)
                .isCompleted(false)
                .build();

        when(goalRepository.findById(goalId)).thenReturn(Optional.empty());

        // when & then
        assertThrows(RuntimeException.class, () -> {
            stepService.createStep(request, goalId);
        });
        verify(goalRepository).findById(goalId);
        verify(stepRepository, never()).save(any(Step.class));
    }

    @Test
    void testCreateStep_Unauthorized() {
        // given
        UUID otherUserId = UUID.randomUUID();
        User otherUser = User.builder()
                .id(otherUserId)
                .email("other@example.com")
                .name("Other User")
                .build();

        Goal otherGoal = Goal.builder()
                .id(goalId)
                .title("Other Goal")
                .user(otherUser)
                .build();

        StepRequest request = StepRequest.builder()
                .title("Test Step")
                .deadline("2026-12-31T23:59:59")
                .position(1)
                .isCompleted(false)
                .build();

        when(goalRepository.findById(goalId)).thenReturn(Optional.of(otherGoal));

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            stepService.createStep(request, goalId);
        });
        assertEquals("Unauthorized: Goal does not belong to user", exception.getMessage());
        verify(goalRepository).findById(goalId);
        verify(stepRepository, never()).save(any(Step.class));
    }

    @Test
    void testCreateStep_WithCompletedStep() {
        // given
        StepRequest request = StepRequest.builder()
                .title("Completed Step")
                .deadline("2026-12-31T23:59:59")
                .position(2)
                .isCompleted(true)
                .build();

        LocalDateTime completedAt = LocalDateTime.now();
        Step mockStep = Step.builder()
                .id(UUID.randomUUID())
                .title("Completed Step")
                .deadline(LocalDateTime.parse("2026-12-31T23:59:59"))
                .position(2)
                .isCompleted(true)
                .goal(mockGoal)
                .createdAt(LocalDateTime.now())
                .completedAt(completedAt)
                .build();

        when(goalRepository.findById(goalId)).thenReturn(Optional.of(mockGoal));
        when(stepRepository.save(any(Step.class))).thenReturn(mockStep);

        // when
        StepResponse actual = stepService.createStep(request, goalId);

        // then
        assertNotNull(actual);
        assertEquals("Completed Step", actual.getTitle());
        assertEquals(2, actual.getPosition());
        assertEquals(true, actual.getIsCompleted());
        assertNotNull(actual.getCompletedAt());
        verify(goalRepository).findById(goalId);
        verify(stepRepository).save(any(Step.class));
    }
}
