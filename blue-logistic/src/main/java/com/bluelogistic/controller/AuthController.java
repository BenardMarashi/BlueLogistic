package com.bluelogistic.controller;

import com.bluelogistic.dto.*;
import com.bluelogistic.entity.User;
import com.bluelogistic.mapper.UserMapper;
import com.bluelogistic.service.AuthService;
import com.bluelogistic.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and account management")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    @PostMapping("/login")
    @Operation(
        summary = "Authenticate user",
        description = "Authenticates a user with email and password, returns a JWT token for subsequent requests"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Successfully authenticated",
            content = @Content(schema = @Schema(implementation = LoginResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request body",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Invalid credentials",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
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
    @Operation(
        summary = "Get current user",
        description = "Returns the profile information of the currently authenticated user"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved user profile",
            content = @Content(schema = @Schema(implementation = UserResponse.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Not authenticated or invalid token",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserResponse> getCurrentUser(
            @Parameter(description = "JWT Bearer token", required = true, example = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        UUID userId = jwtService.extractUserId(token);
        User currentUser = authService.getCurrentUser(userId);
        return ResponseEntity.ok(userMapper.toResponse(currentUser));
    }

    @PatchMapping("/password")
    @Operation(
        summary = "Change password",
        description = "Changes the password of the currently authenticated user"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "204",
            description = "Password changed successfully"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request body or password requirements not met",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Not authenticated or current password incorrect",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> changePassword(
            @Parameter(description = "JWT Bearer token", required = true, example = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ChangePasswordRequest request) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        UUID userId = jwtService.extractUserId(token);
        authService.changePassword(userId, request.currentPassword(), request.newPassword());
        return ResponseEntity.noContent().build();
    }
}
