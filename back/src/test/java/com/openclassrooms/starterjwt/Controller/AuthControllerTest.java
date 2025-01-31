package com.openclassrooms.starterjwt.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.assertTrue;

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

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles("test")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Authenticate admin")
    public void shouldAuthenticateAdmin() throws Exception {
        String adminCredentials = "{\"email\": \"yoga@studio.com\", \"password\": \"test!1234\"}";

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(adminCredentials))
                .andExpect(status().isOk())
                .andReturn();

        assertTrue(result.getResponse().getContentAsString().contains("\"admin\":true"));
    }

    @Test
    @DisplayName("Register new user")
    public void shouldRegisterUser() throws Exception {
        String newUserDetails = "{\"lastName\": \"Wass\", \"firstName\": \"Wass\", \"email\": \"wasswass@gmail.com\", \"password\": \"wass123\"}";

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newUserDetails))
                .andExpect(status().isOk())
                .andReturn();

        assertTrue(result.getResponse().getContentAsString().contains("User registered successfully!"));
    }
    
    @Test
    @DisplayName("Fail authentication with invalid password")
    public void shouldFailAuthenticationWithInvalidPassword() throws Exception {
        String invalidCredentials = "{\"email\": \"wasswass@gmail.com\", \"password\": \"awss123\"}";

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidCredentials))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Fail registration with already existing email")
    public void shouldFailRegistrationWithDuplicateEmail() throws Exception {
        String duplicateUserDetails = "{\"lastName\": \"Admin\", \"firstName\": \"Admin\", \"email\": \"yoga@studio.com\", \"password\": \"awss123\"}";

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(duplicateUserDetails))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertTrue(result.getResponse().getContentAsString().contains("Error: Email is already taken!"));
    }
}