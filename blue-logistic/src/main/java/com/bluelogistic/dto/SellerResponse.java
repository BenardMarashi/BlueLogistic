package com.bluelogistic.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Seller account information")
public record SellerResponse(
    @Schema(description = "Unique identifier of the seller", example = "550e8400-e29b-41d4-a716-446655440000")
    UUID id,

    @Schema(description = "Unique identifier of the associated user account", example = "550e8400-e29b-41d4-a716-446655440001")
    UUID userId,

    @Schema(description = "Full name of the seller", example = "John Smith")
    String name,

    @Schema(description = "Email address of the seller", example = "john.smith@company.com")
    String email,

    @Schema(description = "Name of the seller's company", example = "ABC Electronics Ltd")
    String companyName,

    @Schema(description = "Whether the seller account is active", example = "true")
    boolean isActive,

    @Schema(description = "Timestamp when the seller was created", example = "2024-01-15T10:30:00")
    LocalDateTime createdAt,

    @Schema(description = "Timestamp when the seller was last updated", example = "2024-01-15T10:30:00")
    LocalDateTime updatedAt
) {}
