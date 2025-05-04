package com.openclassrooms.starterjwt.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.jayway.jsonpath.JsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles("test")
public class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private String token;

    @BeforeAll
    public void setup() throws Exception {
        // Authentification admin
        String loginPayload = "{" +
                "\"email\": \"yoga@studio.com\"," +
                "\"password\": \"test!1234\"}";

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginPayload))
                .andExpect(status().isOk())
                .andReturn();

        token = "Bearer " + JsonPath.read(result.getResponse().getContentAsString(), "$.token");

        // Création d'une session initiale pour les tests
        String sessionPayload = "{" +
                "    \"name\": \"Session1\"," +
                "    \"date\": \"2025-03-10\"," +
                "    \"teacher_id\": 1," +
                "    \"description\": \"Session description1\"" +
                "}";

        mockMvc.perform(post("/api/session")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(sessionPayload))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Create a session")
    public void shouldCreateSession() throws Exception {
        String sessionPayload = "{" +
                "    \"name\": \"Valid Session\"," +
                "    \"date\": \"2025-04-01\"," +
                "    \"teacher_id\": 1," +
                "    \"description\": \"A valid test session\"" +
                "}";

        mockMvc.perform(post("/api/session")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(sessionPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo("Valid Session")));
    }

    @Test
    @DisplayName("Get session by ID")
    public void shouldGetSessionById() throws Exception {
        mockMvc.perform(get("/api/session/1")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo("Session1")));
    }

    @Test
    @DisplayName("update session informations")
    public void shouldUpdateSession() throws Exception {
        String updatedSession = "{" +
                "    \"name\": \"Session1 update\"," +
                "    \"date\": \"2025-03-10\"," +
                "    \"teacher_id\": 1," +
                "    \"description\": \"Session description\"" +
                "}";

        mockMvc.perform(put("/api/session/1")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatedSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo("Session1 update")));
    }

    @Test
    @DisplayName("get all sessions")
    public void shouldGetAllSessions() throws Exception {
        mockMvc.perform(get("/api/session")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").exists());
    }
}