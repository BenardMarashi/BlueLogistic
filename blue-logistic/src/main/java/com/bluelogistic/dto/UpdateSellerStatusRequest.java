package com.bluelogistic.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateSellerStatusRequest(
    @NotNull(message = "Active status is required")
    Boolean isActive
) {}