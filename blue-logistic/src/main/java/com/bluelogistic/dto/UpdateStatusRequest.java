package com.bluelogistic.dto;

import com.bluelogistic.entity.enums.PackageStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request to update package status")
public record UpdateStatusRequest(
    @Schema(description = "New status for the package. Valid transitions: CREATED → IN_STORAGE → DISPATCHED", example = "IN_STORAGE", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Status is required")
    PackageStatus status
) {}
