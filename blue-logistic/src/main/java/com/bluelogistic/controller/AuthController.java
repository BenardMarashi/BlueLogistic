package com.bluelogistic.controller;

import com.bluelogistic.dto.*;
import com.bluelogistic.entity.User;
import com.bluelogistic.mapper.UserMapper;
import com.bluelogistic.service.AuthService;
import com.bluelogistic.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = authService.authenticate(request.email(), request.password());
        String token = jwtService.generateToken(user);
        
        LoginResponse response = new LoginResponse(
            token,
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole().name()
        );
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        UUID userId = jwtService.extractUserId(token);
        User currentUser = authService.getCurrentUser(userId);
        return ResponseEntity.ok(userMapper.toResponse(currentUser));
    }
    
    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ChangePasswordRequest request) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        UUID userId = jwtService.extractUserId(token);
        authService.changePassword(userId, request.currentPassword(), request.newPassword());
        return ResponseEntity.noContent().build();
    }
}