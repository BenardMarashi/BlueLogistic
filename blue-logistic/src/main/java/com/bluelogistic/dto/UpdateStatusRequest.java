package com.bluelogistic.dto;

import com.bluelogistic.entity.enums.PackageStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(
    @NotNull(message = "Status is required")
    PackageStatus status
) {}