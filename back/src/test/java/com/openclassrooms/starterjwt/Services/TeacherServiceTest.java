package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@SpringBootTest
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepo;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    @DisplayName("Should get all teachers")
    public void shouldGetAllTeachers() {
        List<Teacher> mockTeachers = List.of(
            new Teacher(1L, "Delahaye", "Margot", LocalDateTime.now(), LocalDateTime.now()),
            new Teacher(2L, "Thiercelin", "Hélène", LocalDateTime.now(), LocalDateTime.now())
        );
        when(teacherRepo.findAll()).thenReturn(mockTeachers);

        List<Teacher> result = teacherService.findAll();

        assertEquals(mockTeachers, result);
        verify(teacherRepo, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return an empty list if no teachers exist")
    public void shouldReturnEmptyListIfNoTeachersExist() {
        when(teacherRepo.findAll()).thenReturn(Collections.emptyList());

        List<Teacher> result = teacherService.findAll();

        assertTrue(result.isEmpty());
        verify(teacherRepo, times(1)).findAll();
    }

    @Test
    @DisplayName("Should get a teacher by ID")
    public void shouldGetTeacherById() {
        Teacher mockTeacher = new Teacher(1L, "Delahaye", "Margot", LocalDateTime.now(), LocalDateTime.now());
        when(teacherRepo.findById(1L)).thenReturn(Optional.of(mockTeacher));

        Teacher result = teacherService.findById(1L);

        assertEquals(mockTeacher, result);
        verify(teacherRepo, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should return null for a non-existing teacher ID")
    public void shouldReturnNullForNonExistingId() {
        when(teacherRepo.findById(99L)).thenReturn(Optional.empty());

        Teacher result = teacherService.findById(56L);

        assertNull(result);
        verify(teacherRepo, times(1)).findById(56L);
    }
}