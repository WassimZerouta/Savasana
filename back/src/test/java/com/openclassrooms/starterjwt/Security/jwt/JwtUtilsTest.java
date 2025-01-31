package com.openclassrooms.starterjwt.security.jwt;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Date;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@SpringBootTest
public class JwtUtilsTest {

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    @DisplayName("Generate token")
    public void shouldGeneratetToken() {
        UserDetailsImpl mockUser = new UserDetailsImpl(1L, "wassim.zerouta@gmail.com", "Wassim", "Zerouta", false, "waswas123");
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(mockUser, null);

        String jwtToken = jwtUtils.generateJwtToken(authentication);

        assertTrue(jwtUtils.validateJwtToken(jwtToken), "Token should be valid.");
    }

    @Test
    @DisplayName("Invalidate token with bad signature")
    public void shouldInvalidateTokenWithBadSignature() {
        String invalidToken = Jwts.builder()
                .setSubject("wassim.zerouta@gmail.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) 
                .signWith(SignatureAlgorithm.HS512, "azerty123")
                .compact();

        assertFalse(jwtUtils.validateJwtToken(invalidToken), "Token with invalid signature should be rejected.");
    }
}