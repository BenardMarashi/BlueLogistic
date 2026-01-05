package com.bluelogistic.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Request to change user password")
public record ChangePasswordRequest(
    @Schema(description = "Current password for verification", example = "oldPassword123", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Current password is required")
    String currentPassword,

    @Schema(description = "New password (minimum 8 characters)", example = "newSecurePassword123", minLength = 8, requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    String newPassword
) {}
