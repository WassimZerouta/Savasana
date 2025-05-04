package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    @DisplayName("Should get user by ID")
    public void shouldGetUserById() {
        User retrievedUser = userService.findById(1L);

        assertNotNull(retrievedUser);
        assertEquals("yoga@studio.com", retrievedUser.getEmail());
    }

    @Test
    @DisplayName("Should return null when user ID does not exist")
    public void shouldReturnNullForNonExistingUserId() {
        User result = userService.findById(57L);

        assertNull(result);
    }

    @Test
    @DisplayName("Should delete user by ID")
    public void shouldDeleteUserById() {
        userService.delete(2L);

        assertNull(userService.findById(2L));
    }
}