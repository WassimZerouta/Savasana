package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class TeacherServiceTest {

    @Autowired
    private TeacherService teacherService;

    @Test
    @DisplayName("Should get all teachers")
    public void shouldGetAllTeachers() {
        List<Teacher> result = teacherService.findAll();

        assertNotNull(result);
        assertTrue(result.size() == 2);
    }

    @Test
    @DisplayName("Should get a teacher by ID")
    public void shouldGetTeacherById() {
        Teacher result = teacherService.findById(1L);

        assertNotNull(result);
        assertEquals("Margot", result.getFirstName());
    }

    @Test
    @DisplayName("Should return null for a non-existing teacher ID")
    public void shouldReturnNullForNonExistingId() {
        Teacher result = teacherService.findById(999L);

        assertNull(result);
    }
}