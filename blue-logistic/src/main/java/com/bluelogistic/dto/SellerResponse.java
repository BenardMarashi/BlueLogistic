package com.bluelogistic.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record SellerResponse(
    UUID id,
    UUID userId,
    String name,
    String email,
    String companyName,
    boolean isActive,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}