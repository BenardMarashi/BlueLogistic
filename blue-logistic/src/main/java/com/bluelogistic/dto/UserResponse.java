package com.bluelogistic.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "User profile information")
public record UserResponse(
    @Schema(description = "Unique identifier of the user", example = "550e8400-e29b-41d4-a716-446655440000")
    UUID id,

    @Schema(description = "User's email address", example = "admin@bluelogistic.com")
    String email,

    @Schema(description = "User's display name", example = "Admin User")
    String name,

    @Schema(description = "User's role in the system", example = "ADMIN", allowableValues = {"ADMIN", "SELLER"})
    String role,

    @Schema(description = "Timestamp when the user was created", example = "2024-01-15T10:30:00")
    LocalDateTime createdAt,

    @Schema(description = "Timestamp when the user was last updated", example = "2024-01-15T10:30:00")
    LocalDateTime updatedAt
) {}
