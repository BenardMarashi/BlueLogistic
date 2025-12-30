package com.bluelogistic.dto;

import java.util.UUID;

public record LoginResponse(
    String token,
    UUID userId,
    String email,
    String name,
    String role
) {}