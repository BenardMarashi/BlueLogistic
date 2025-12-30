package com.bluelogistic.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PackageResponse(
    String id,
    String sellerId,
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