package com.example.goals_tracker.controller;

import com.example.goals_tracker.dto.CreateUserRequest;
import com.example.goals_tracker.dto.UserResponse;
import com.example.goals_tracker.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    @Test
    void shouldCreateUser() {
        // given
        CreateUserRequest request = CreateUserRequest.builder()
                .email("test@example.com")
                .password("password123")
                .name("Test User")
                .build();

        UserResponse userResponse = UserResponse.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .name("Test User")
                .level(1)
                .xpPoints(0)
                .createdAt(LocalDateTime.now())
                .build();

        when(userService.createUser(any(CreateUserRequest.class))).thenReturn(userResponse);

        // when
        ResponseEntity<UserResponse> response = userController.createUser(request);

        // then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("test@example.com", response.getBody().getEmail());
        assertEquals("Test User", response.getBody().getName());
        assertEquals(Integer.valueOf(1), response.getBody().getLevel());
        assertEquals(Integer.valueOf(0), response.getBody().getXpPoints());
        assertNotNull(response.getBody().getId());
        assertNotNull(response.getBody().getCreatedAt());
    }

    @Test
    void shouldCallUserServiceWithCorrectRequest() {
        // given
        CreateUserRequest request = CreateUserRequest.builder()
                .email("another@example.com")
                .password("password456")
                .name("Another User")
                .build();

        UserResponse userResponse = UserResponse.builder()
                .id(UUID.randomUUID())
                .email("another@example.com")
                .name("Another User")
                .level(1)
                .xpPoints(0)
                .createdAt(LocalDateTime.now())
                .build();

        when(userService.createUser(any(CreateUserRequest.class))).thenReturn(userResponse);

        // when
        ResponseEntity<UserResponse> response = userController.createUser(request);

        // then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("another@example.com", response.getBody().getEmail());
        assertEquals("Another User", response.getBody().getName());
    }
}
