package com.bluelogistic.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Error response returned when an API request fails")
public record ErrorResponse(
    @Schema(description = "HTTP status code", example = "400")
    int status,

    @Schema(description = "Error message describing what went wrong", example = "Validation failed")
    String message,

    @Schema(description = "List of detailed error messages (for validation errors)", example = "[\"Email is required\", \"Password must be at least 8 characters\"]", nullable = true)
    List<String> errors,

    @Schema(description = "Timestamp when the error occurred", example = "2024-01-15T10:30:00")
    LocalDateTime timestamp
) {
    public ErrorResponse(int status, String message) {
        this(status, message, null, LocalDateTime.now());
    }

    public ErrorResponse(int status, String message, List<String> errors) {
        this(status, message, errors, LocalDateTime.now());
    }
}
