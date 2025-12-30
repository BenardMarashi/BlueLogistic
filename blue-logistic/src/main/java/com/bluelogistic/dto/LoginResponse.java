package com.bluelogistic.dto;

public record LoginResponse(
    String token,
    String userId,
    String email,
    String name,
    String role
) {}