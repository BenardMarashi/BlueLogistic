package com.bluelogistic.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request to update seller active status")
public record UpdateSellerStatusRequest(
    @Schema(description = "Whether to activate (true) or deactivate (false) the seller", example = "true", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Active status is required")
    Boolean isActive
) {}
