package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

@SpringBootTest
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepo;

    @Mock
    private UserRepository userRepo;

    @InjectMocks
    private SessionService sessionService;

    private List<Session> sessionCollection;
    private Session session;

    @BeforeEach
    public void init() {
        Teacher teacher = new Teacher(
                1L,
                "WASS",
                "wass",
                LocalDateTime.parse("2025-01-01T12:00:00"),
                LocalDateTime.parse("2025-01-01T12:00:00")
        );
        this.session = new Session(
                1L,
                "Session1",
                new Date(),
                "Session1 description",
                teacher,
                new ArrayList<>(),
                LocalDateTime.parse("2025-01-01T00:00:00"),
                LocalDateTime.parse("2025-01-01T00:00:00")
        );
        this.sessionCollection = List.of(
                this.session,
                new Session(
                        2L,
                        "Session2",
                        new Date(),
                        "Session2 description",
                        teacher,
                        new ArrayList<>(),
                        LocalDateTime.parse("2025-01-01T00:00:00"),
                        LocalDateTime.parse("2025-01-01T00:00:00")
                )
        );
    }

    @Test
    @DisplayName("Create a session")
    public void shouldCreateSession() {
        when(sessionRepo.save(session)).thenReturn(session);

        Session createdSession = sessionService.create(session);

        assertEquals(session, createdSession);
        verify(sessionRepo, times(1)).save(session);
    }

    @Test
    @DisplayName("Delete session by ID")
    public void shouldDeleteSession() {
        sessionService.delete(1L);

        verify(sessionRepo, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Get all sessions")
    public void shouldGetAllSessions() {
        when(sessionRepo.findAll()).thenReturn(sessionCollection);

        List<Session> sessions = sessionService.findAll();

        assertEquals(2, sessions.size());
        assertEquals("Session1", sessions.get(0).getName());
        assertEquals("Session2", sessions.get(1).getName());
        verify(sessionRepo, times(1)).findAll();
    }

    @Test
    @DisplayName("get session ID")
    public void shouldGetSessionById() {
        when(sessionRepo.findById(1L)).thenReturn(Optional.of(session));

        Session foundSession = sessionService.getById(1L);

        assertEquals(session, foundSession);
        verify(sessionRepo, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Update session")
    public void shouldUpdateSession() {
        when(sessionRepo.save(session)).thenReturn(session);

        Session updatedSession = sessionService.update(1L, session);

        assertEquals(session, updatedSession);
        verify(sessionRepo, times(1)).save(session);
    }

    @Test
    @DisplayName("User participates in a session")
    public void shouldParticipateInSession() {

        User user = new User(1L
        , "joe@gmail.com"
        , "Joe"
        , "Fat"
        , "fatjoe123"
        , false
        , LocalDateTime.now(), LocalDateTime.now()
        );
        when(sessionRepo.findById(1L)).thenReturn(Optional.of(session));
        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(sessionRepo.save(session)).thenReturn(session);

        sessionService.participate(1L, 1L);

        assertTrue(session.getUsers().contains(user));
        verify(sessionRepo).save(session);
    }

    @Test
    @DisplayName("Throw exception when participating in a non-existent session")
    public void shouldThrowExceptionWhenNoSessionFound() {
        when(sessionRepo.findById(1L)).thenReturn(Optional.empty());
        when(userRepo.findById(1L)).thenReturn(Optional.of(new User()));

        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    @DisplayName("Throw exception when user is not found for participation")
    public void shouldThrowExceptionWhenUserNotFound() {
        when(sessionRepo.findById(1L)).thenReturn(Optional.of(session));
        when(userRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    @DisplayName("Throw exception when user already participates")
    public void shouldThrowExceptionWhenUserAlreadyParticipates() {
        User user = new User(1L, "joe@gmail.com", "Joe", "Fat", "fatjoe123", false,
                LocalDateTime.now(), LocalDateTime.now());
        session.getUsers().add(user);
        when(sessionRepo.findById(1L)).thenReturn(Optional.of(session));
        when(userRepo.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    @DisplayName("User cancels participation in a session")
    public void shouldCancelParticipation() {
        User user = new User(1L
        , "joe@gmail.com"
        , "Joe"
        , "Fat"
        , "fatjoe123"
        , false
        , LocalDateTime.now(), LocalDateTime.now()
        );
        session.getUsers().add(user);
        when(sessionRepo.findById(1L)).thenReturn(Optional.of(session));
        when(sessionRepo.save(session)).thenReturn(session);

        sessionService.noLongerParticipate(1L, 1L);

        assertFalse(session.getUsers().contains(user));
        verify(sessionRepo).save(session);
    }

    @Test
    @DisplayName("Throw exception when cancelling participation without being a participant")
    public void shouldThrowExceptionWhenNotParticipating() {
        when(sessionRepo.findById(1L)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 1L));
    }
}