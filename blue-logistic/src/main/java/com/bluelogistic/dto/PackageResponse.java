package com.bluelogistic.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PackageResponse(
    UUID id,
    UUID sellerId,
    String sellerName,
    String trackingNumber,
    String description,
    BigDecimal weight,
    String customerName,
    String customerEmail,
    String customerPhone,
    String deliveryAddress,
    String status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}