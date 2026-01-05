package com.bluelogistic.controller;

import com.bluelogistic.dto.AuditLogResponse;
import com.bluelogistic.entity.enums.AuditAction;
import com.bluelogistic.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Audit", description = "Audit log endpoints (Admin only)")
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    @Operation(summary = "Get paginated audit logs with filters")
    public ResponseEntity<Page<AuditLogResponse>> getAuditLogs(
            @Parameter(description = "Filter by user ID")
            @RequestParam(required = false) UUID userId,
            @Parameter(description = "Filter by action type")
            @RequestParam(required = false) AuditAction action,
            @Parameter(description = "Filter by entity type (e.g., Package, Seller)")
            @RequestParam(required = false) String entityType,
            @Parameter(description = "Filter by start date (ISO-8601)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @Parameter(description = "Filter by end date (ISO-8601)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate,
            @PageableDefault(size = 20, sort = "timestamp", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<AuditLogResponse> auditLogs = auditService.getAuditLogs(userId, action, entityType, startDate, endDate, pageable);
        return ResponseEntity.ok(auditLogs);
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    @Operation(summary = "Get audit history for a specific entity")
    public ResponseEntity<List<AuditLogResponse>> getEntityHistory(
            @Parameter(description = "Entity type (e.g., Package, Seller)")
            @PathVariable String entityType,
            @Parameter(description = "Entity ID")
            @PathVariable UUID entityId) {

        List<AuditLogResponse> history = auditService.getEntityHistory(entityType, entityId);
        return ResponseEntity.ok(history);
    }
}
