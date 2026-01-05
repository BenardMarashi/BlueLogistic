package com.bluelogistic.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "Response containing JWT token and user information after successful login")
public record LoginResponse(
    @Schema(description = "JWT authentication token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    String token,

    @Schema(description = "Unique identifier of the user", example = "550e8400-e29b-41d4-a716-446655440000")
    UUID userId,

    @Schema(description = "User's email address", example = "admin@bluelogistic.com")
    String email,

    @Schema(description = "User's display name", example = "Admin User")
    String name,

    @Schema(description = "User's role in the system", example = "ADMIN", allowableValues = {"ADMIN", "SELLER"})
    String role
) {}
