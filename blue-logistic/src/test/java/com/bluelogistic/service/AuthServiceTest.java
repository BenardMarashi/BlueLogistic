package com.bluelogistic.service;

import com.bluelogistic.entity.User;
import com.bluelogistic.entity.enums.Role;
import com.bluelogistic.exception.BusinessException;
import com.bluelogistic.exception.ResourceNotFoundException;
import com.bluelogistic.exception.UnauthorizedException;
import com.bluelogistic.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId("user-123");
        testUser.setEmail("test@example.com");
        testUser.setPasswordHash("hashedPassword");
        testUser.setName("Test User");
        testUser.setRole(Role.SELLER);
    }

    @Test
    void authenticate_ValidCredentials_ReturnsUser() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);

        // Act
        User result = authService.authenticate("test@example.com", "password123");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("test@example.com");
        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    void authenticate_InvalidEmail_ThrowsUnauthorizedException() {
        // Arrange
        when(userRepository.findByEmail("wrong@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.authenticate("wrong@example.com", "password123"))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    void authenticate_InvalidPassword_ThrowsUnauthorizedException() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> authService.authenticate("test@example.com", "wrongPassword"))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    void getCurrentUser_ExistingUser_ReturnsUser() {
        // Arrange
        when(userRepository.findById("user-123")).thenReturn(Optional.of(testUser));

        // Act
        User result = authService.getCurrentUser("user-123");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("user-123");
    }

    @Test
    void getCurrentUser_NonExistingUser_ThrowsResourceNotFoundException() {
        // Arrange
        when(userRepository.findById("non-existing")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.getCurrentUser("non-existing"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void changePassword_ValidCurrentPassword_UpdatesPassword() {
        // Arrange
        when(userRepository.findById("user-123")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("currentPassword", "hashedPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("newHashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        authService.changePassword("user-123", "currentPassword", "newPassword");

        // Assert
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("newPassword");
    }

    @Test
    void changePassword_InvalidCurrentPassword_ThrowsBusinessException() {
        // Arrange
        when(userRepository.findById("user-123")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> authService.changePassword("user-123", "wrongPassword", "newPassword"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Current password is incorrect");
    }

    @Test
    void loadUserByUsername_ExistingEmail_ReturnsUserDetails() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        var result = authService.loadUserByUsername("test@example.com");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("test@example.com");
    }
}