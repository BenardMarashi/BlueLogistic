package com.bluelogistic.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Package information")
public record PackageResponse(
    @Schema(description = "Unique identifier of the package", example = "550e8400-e29b-41d4-a716-446655440000")
    UUID id,

    @Schema(description = "Unique identifier of the seller who created the package", example = "550e8400-e29b-41d4-a716-446655440001")
    UUID sellerId,

    @Schema(description = "Name of the seller's company", example = "ABC Electronics Ltd")
    String sellerName,

    @Schema(description = "Tracking number for the package (assigned by admin)", example = "TRK-2024-001234", nullable = true)
    String trackingNumber,

    @Schema(description = "Description of the package contents", example = "Electronics - Laptop")
    String description,

    @Schema(description = "Weight of the package in kilograms", example = "2.5")
    BigDecimal weight,

    @Schema(description = "Name of the customer receiving the package", example = "John Doe")
    String customerName,

    @Schema(description = "Email address of the customer", example = "john.doe@example.com")
    String customerEmail,

    @Schema(description = "Phone number of the customer", example = "+1234567890")
    String customerPhone,

    @Schema(description = "Full delivery address", example = "123 Main Street, Apt 4B, New York, NY 10001")
    String deliveryAddress,

    @Schema(description = "Current status of the package", example = "CREATED", allowableValues = {"CREATED", "IN_STORAGE", "DISPATCHED"})
    String status,

    @Schema(description = "Timestamp when the package was created", example = "2024-01-15T10:30:00")
    LocalDateTime createdAt,

    @Schema(description = "Timestamp when the package was last updated", example = "2024-01-15T10:30:00")
    LocalDateTime updatedAt,

    @Schema(description = "Destination country ISO code", example = "AT")
    String destinationCountry,

    @Schema(description = "Cost price in EUR (admin only)", example = "8.30", nullable = true)
    BigDecimal costPrice,

    @Schema(description = "Seller price in EUR (cost × 2)", example = "16.60")
    BigDecimal sellerPrice,

    @Schema(description = "Price calculation breakdown (admin only)", example = "1×25kg + 1×15kg", nullable = true)
    String priceBreakdown
) {}
