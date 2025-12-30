package com.bluelogistic.dto;

import java.time.LocalDateTime;

public record SellerResponse(
    String id,
    String userId,
    String name,
    String email,
    String companyName,
    boolean isActive,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}