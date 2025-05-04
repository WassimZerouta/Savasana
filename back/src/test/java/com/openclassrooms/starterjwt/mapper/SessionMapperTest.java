package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@SpringBootTest
public class SessionMapperTest {

    @Autowired
    private SessionMapper sessionMapper;

    @MockBean
    private TeacherService teacherService;

    @MockBean
    private UserService userService;

    private Teacher mockTeacher;
    private User mockUser1;
    private User mockUser2;

    @BeforeEach
    void setup() {
        mockTeacher = new Teacher();
        mockTeacher.setId(1L);
        mockTeacher.setLastName("Zerouta");

        mockUser1 = new User();
        mockUser1.setId(10L);

        mockUser2 = new User();
        mockUser2.setId(20L);

        when(teacherService.findById(1L)).thenReturn(mockTeacher);
        when(userService.findById(10L)).thenReturn(mockUser1);
        when(userService.findById(20L)).thenReturn(mockUser2);
    }

    @Test
    @DisplayName("should map SessionDto to Session entity")
    void shouldMapDtoToEntity() {
        SessionDto dto = new SessionDto();
        dto.setDescription("Test session");
        dto.setTeacher_id(1L);
        dto.setUsers(List.of(10L, 20L));

        Session session = sessionMapper.toEntity(dto);

        assertThat(session.getDescription()).isEqualTo("Test session");
        assertThat(session.getTeacher()).isEqualTo(mockTeacher);
        assertThat(session.getUsers()).containsExactly(mockUser1, mockUser2);
    }

    @Test
    @DisplayName("should map Session to SessionDto")
    void shouldMapEntityToDto() {
        Session session = new Session();
        session.setDescription("Back to DTO");
        session.setTeacher(mockTeacher);
        session.setUsers(List.of(mockUser1, mockUser2));

        SessionDto dto = sessionMapper.toDto(session);

        assertThat(dto.getDescription()).isEqualTo("Back to DTO");
        assertThat(dto.getTeacher_id()).isEqualTo(1L);
        assertThat(dto.getUsers()).containsExactly(10L, 20L);
    }
}