package com.bluelogistic.dto;

import com.bluelogistic.entity.enums.AuditAction;

import java.time.Instant;
import java.util.UUID;

public record AuditLogResponse(
        UUID id,
        UUID userId,
        String userEmail,
        AuditAction action,
        String entityType,
        UUID entityId,
        String oldValue,
        String newValue,
        String ipAddress,
        String userAgent,
        Instant timestamp,
        String correlationId
) {
}
