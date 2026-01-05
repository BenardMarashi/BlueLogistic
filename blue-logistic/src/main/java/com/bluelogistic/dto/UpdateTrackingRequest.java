package com.bluelogistic.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Request to update package tracking number")
public record UpdateTrackingRequest(
    @Schema(description = "Tracking number for the package", example = "TRK-2024-001234", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Tracking number is required")
    String trackingNumber
) {}
