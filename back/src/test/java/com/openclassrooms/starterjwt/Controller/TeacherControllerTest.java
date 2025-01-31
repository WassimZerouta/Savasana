package com.openclassrooms.starterjwt.controllers;

import static org.hamcrest.Matchers.is;
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
public class TeacherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private String token;

    @BeforeAll
    public void authenticate() throws Exception {
        String loginPayload = "{" +
                "\"email\": \"yoga@studio.com\"," +
                "\"password\": \"test!1234\"}";

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginPayload))
                .andExpect(status().isOk())
                .andReturn();

        token = "Bearer " + JsonPath.read(result.getResponse().getContentAsString(), "$.token");
    }

    @Test
    @DisplayName("get all teachers")
    public void shouldGetAllTeachers() throws Exception {
        mockMvc.perform(get("/api/teacher")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].lastName", is("DELAHAYE")))
                .andExpect(jsonPath("$[1].lastName", is("THIERCELIN")));
    }

    @Test
    @DisplayName("get teacher by ID")
    public void shouldGetTeacherById() throws Exception {
        mockMvc.perform(get("/api/teacher/1")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName", is("DELAHAYE")));
    }

    @Test
    @DisplayName("Error when teacher by invalid ID")
    public void shouldHandleInvalidTeacherId() throws Exception {
        mockMvc.perform(get("/api/teacher/abc")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Handle teacher not found")
    public void shouldHandleTeacherNotFound() throws Exception {
        mockMvc.perform(get("/api/teacher/999")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token))
                .andExpect(status().isNotFound());
    }

    @Test
@DisplayName("Handle unauthorized access")
public void shouldHandleUnauthorizedAccess() throws Exception {
    mockMvc.perform(get("/api/teacher")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isUnauthorized());
}
}