package com.example.goals_tracker;

import com.example.goals_tracker.dto.CreateUserRequest;
import com.example.goals_tracker.dto.UserResponse;
import com.example.goals_tracker.exception.EmailAlreadyExistsException;
import com.example.goals_tracker.model.User;
import com.example.goals_tracker.repository.UserRepository;
import com.example.goals_tracker.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    
    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    public void testCreateUser_Success() {
        // given
        CreateUserRequest request = CreateUserRequest
                .builder()
                .email("test@example.com")
                .password("test")
                .name("Test User")
                .build();

        User mockUser = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .name("Test User")
                .password("encoded_password")
                .build();

        UserResponse expected = UserResponse.builder()
                .id(mockUser.getId())
                .email("test@example.com")
                .name("Test User")
                .build();

        // when
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("test")).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        UserResponse actual = userService.createUser(request);

        // then
        assertEquals(expected.getEmail(), actual.getEmail());
        assertEquals(expected.getName(), actual.getName());
        assertEquals(expected.getId(), actual.getId());
    }

    @Test
    public void testCreateUser_EmailAlreadyExists() {
        // given
        CreateUserRequest request = CreateUserRequest
                .builder()
                .email("existing@example.com")
                .password("test")
                .name("Test User")
                .build();

        // when
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // then
        assertThrows(EmailAlreadyExistsException.class, () -> {
            userService.createUser(request);
        });
    }
}
