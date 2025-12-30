package com.bluelogistic.dto;

import java.time.LocalDateTime;

public record UserResponse(
    String id,
    String email,
    String name,
    String role,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}