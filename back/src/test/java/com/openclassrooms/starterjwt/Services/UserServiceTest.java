package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@SpringBootTest
public class UserServiceTest {

    @Mock
    private UserRepository userRepo;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("Should get user by ID")
    public void shouldGetUserById() {
        User mockUser = new User(
                1L,
                "wass.wass@example.com",
                "Wass",
                "Wass",
                "wass123",
                false,
                LocalDateTime.parse("2025-01-20T10:00:00"),
                LocalDateTime.parse("2023-01-21T10:00:00")
        );
        when(userRepo.findById(1L)).thenReturn(Optional.of(mockUser));

        User retrievedUser = userService.findById(1L);

        assertEquals(mockUser, retrievedUser);
        verify(userRepo, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should return null when user ID does not exist")
    public void shouldReturnNullForNonExistingUserId() {
        when(userRepo.findById(57L)).thenReturn(Optional.empty());

        User result = userService.findById(57L);

        assertEquals(null, result);
        verify(userRepo, times(1)).findById(57L);
    }

    @Test
    @DisplayName("Should delete user by ID")
    public void shouldDeleteUserById() {
        userService.delete(1L);

        verify(userRepo, times(1)).deleteById(1L);
    }
}