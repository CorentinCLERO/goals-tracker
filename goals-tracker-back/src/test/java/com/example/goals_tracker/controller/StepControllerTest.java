package com.example.goals_tracker.controller;

import com.example.goals_tracker.dto.StepRequest;
import com.example.goals_tracker.dto.StepResponse;
import com.example.goals_tracker.service.StepService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StepControllerTest {

    @InjectMocks
    private StepController stepController;

    @Mock
    private StepService stepService;

    @Test
    void shouldCreateGoalStep() {
        // given
        UUID goalId = UUID.randomUUID();
        StepRequest request = StepRequest.builder()
                .title("Test Step")
                .deadline("2026-12-31T23:59:59")
                .orderBy(1)
                .isCompleted(false)
                .build();

        StepResponse stepResponse = StepResponse.builder()
                .id(UUID.randomUUID().toString())
                .title("Test Step")
                .deadline("2026-12-31T23:59:59")
                .orderBy(1)
                .isCompleted(false)
                .goal(goalId.toString())
                .completedAt(null)
                .createdAt("2026-01-21T10:00:00")
                .build();

        when(stepService.createStep(any(StepRequest.class), eq(goalId))).thenReturn(stepResponse);

        // when
        ResponseEntity<StepResponse> response = stepController.createGoalStep(request, goalId);

        // then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Test Step", response.getBody().getTitle());
        assertEquals(1, response.getBody().getOrderBy());
        assertEquals(false, response.getBody().getIsCompleted());
        assertNull(response.getBody().getCompletedAt());
        assertNotNull(response.getBody().getId());
        verify(stepService).createStep(request, goalId);
    }

    @Test
    void shouldCreateCompletedGoalStep() {
        // given
        UUID goalId = UUID.randomUUID();
        StepRequest request = StepRequest.builder()
                .title("Completed Step")
                .deadline("2026-12-31T23:59:59")
                .orderBy(2)
                .isCompleted(true)
                .build();

        StepResponse stepResponse = StepResponse.builder()
                .id(UUID.randomUUID().toString())
                .title("Completed Step")
                .deadline("2026-12-31T23:59:59")
                .orderBy(2)
                .isCompleted(true)
                .goal(goalId.toString())
                .completedAt("2026-01-21T09:00:00")
                .createdAt("2026-01-21T10:00:00")
                .build();

        when(stepService.createStep(any(StepRequest.class), eq(goalId))).thenReturn(stepResponse);

        // when
        ResponseEntity<StepResponse> response = stepController.createGoalStep(request, goalId);

        // then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Completed Step", response.getBody().getTitle());
        assertEquals(2, response.getBody().getOrderBy());
        assertEquals(true, response.getBody().getIsCompleted());
        assertNotNull(response.getBody().getCompletedAt());
        verify(stepService).createStep(request, goalId);
    }

    @Test
    void shouldCallStepServiceWithCorrectParameters() {
        // given
        UUID goalId = UUID.randomUUID();
        StepRequest request = StepRequest.builder()
                .title("Another Step")
                .deadline("2026-06-15T12:30:00")
                .orderBy(3)
                .isCompleted(false)
                .build();

        StepResponse stepResponse = StepResponse.builder()
                .id(UUID.randomUUID().toString())
                .title("Another Step")
                .deadline("2026-06-15T12:30:00")
                .orderBy(3)
                .isCompleted(false)
                .goal(goalId.toString())
                .completedAt(null)
                .createdAt("2026-01-21T10:00:00")
                .build();

        when(stepService.createStep(any(StepRequest.class), eq(goalId))).thenReturn(stepResponse);

        // when
        ResponseEntity<StepResponse> response = stepController.createGoalStep(request, goalId);

        // then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Another Step", response.getBody().getTitle());
        assertEquals("2026-06-15T12:30:00", response.getBody().getDeadline());
        assertEquals(3, response.getBody().getOrderBy());
        verify(stepService).createStep(request, goalId);
    }
}
