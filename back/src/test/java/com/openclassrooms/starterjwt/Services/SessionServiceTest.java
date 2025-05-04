package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;
import java.util.List;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class SessionServiceTest {

    @Autowired
    private SessionService sessionService;

    @Test
    @DisplayName("Create a session")
    public void shouldCreateSession() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);

        Session session = new Session();
        session.setName("Valid Session");
        session.setDescription("A valid test session");
        session.setDate(new Date());
        session.setTeacher(teacher);

        Session createdSession = sessionService.create(session);

        assertNotNull(createdSession.getId());
        assertEquals("Valid Session", createdSession.getName());
    }

@Test
@DisplayName("Delete session by ID")
public void shouldDeleteSession() {
    Teacher teacher = new Teacher();
    teacher.setId(1L);

    Session session = new Session();
    session.setName("ToDelete");
    session.setDescription("desc");
    session.setDate(new Date());
    session.setTeacher(teacher);

    Session saved = sessionService.create(session);
    sessionService.delete(saved.getId());

    Session deletedSession = sessionService.getById(saved.getId());
    assertNull(deletedSession);
}

    @Test
    @DisplayName("Get all sessions")
    public void shouldGetAllSessions() {
        List<Session> sessions = sessionService.findAll();
        assertNotNull(sessions);
        assertTrue(sessions.size() >= 1);
    }

    @Test
    @DisplayName("Get session by ID")
    public void shouldGetSessionById() {
        Session session = sessionService.getById(1L);
        assertNotNull(session);
        assertEquals("Session1", session.getName());
    }

    @Test
    @DisplayName("Update session")
    public void shouldUpdateSession() {
        Session session = sessionService.getById(1L);
        session.setDescription("Updated");
        Session updated = sessionService.update(1L, session);
        assertEquals("Updated", updated.getDescription());
    }

    @Test
    @DisplayName("User participates in a session")
    public void shouldParticipateInSession() {
        sessionService.participate(1L, 2L);
        Session session = sessionService.getById(1L);
        assertTrue(session.getUsers().stream().anyMatch(u -> u.getId() == 2L));
    }

    @Test
    @DisplayName("Throw exception when participating in a non-existent session")
    public void shouldThrowExceptionWhenNoSessionFound() {
        assertThrows(Exception.class, () -> sessionService.participate(999L, 2L));
    }

    @Test
    @DisplayName("Throw exception when user is not found for participation")
    public void shouldThrowExceptionWhenUserNotFound() {
        assertThrows(Exception.class, () -> sessionService.participate(1L, 999L));
    }

    @Test
    @DisplayName("Throw exception when user already participates")
    public void shouldThrowExceptionWhenUserAlreadyParticipates() {
        sessionService.participate(1L, 2L);
        assertThrows(Exception.class, () -> sessionService.participate(1L, 2L));
    }

    @Test
    @DisplayName("User cancels participation in a session")
    public void shouldCancelParticipation() {
        sessionService.participate(1L, 2L);
        sessionService.noLongerParticipate(1L, 2L);
        Session session = sessionService.getById(1L);
        assertFalse(session.getUsers().stream().anyMatch(u -> u.getId() == 2L));
    }

    @Test
    @DisplayName("Throw exception when cancelling participation without being a participant")
    public void shouldThrowExceptionWhenNotParticipating() {
        assertThrows(Exception.class, () -> sessionService.noLongerParticipate(1L, 3L));
    }
}
