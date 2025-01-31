package com.openclassrooms.starterjwt.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

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
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private String token;

    @BeforeAll
    public void authenticate() throws Exception {
        String loginPayload = "{" +
                "\"email\": \"wass@gmail.com\"," +
                "\"password\": \"test!1234\"}";

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginPayload))
                .andExpect(status().isOk())
                .andReturn();

        token = "Bearer " + JsonPath.read(result.getResponse().getContentAsString(), "$.token");
    }

    @Test
    @DisplayName("get user by ID")
    public void shouldRGetUserById() throws Exception {
        mockMvc.perform(get("/api/user/1")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("yoga@studio.com")));
    }

    @Test
    @DisplayName("Error when invalid ID")
    public void shouldHandleInvalidUserId() throws Exception {
        mockMvc.perform(get("/api/user/abc")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Handle user not found")
    public void shouldHandleUserNotFound() throws Exception {
        mockMvc.perform(get("/api/user/999")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token))
                .andExpect(status().isNotFound());
    }



    @Test
    @DisplayName("Delete user by invalid ID")
    public void shouldHandleDeleteInvalidUserId() throws Exception {
        mockMvc.perform(delete("/api/user/abc")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", token))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Handle unauthorized delete")
    public void shouldHandleUnauthorizedDelete() throws Exception {
        String unauthorizedToken = "Bearer unauthorized-token";

        mockMvc.perform(delete("/api/user/1")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", unauthorizedToken))
                .andExpect(status().isUnauthorized());
    }
}
