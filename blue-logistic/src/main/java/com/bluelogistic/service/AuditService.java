package com.bluelogistic.service;

import com.bluelogistic.dto.AuditLogResponse;
import com.bluelogistic.entity.AuditLog;
import com.bluelogistic.entity.enums.AuditAction;
import com.bluelogistic.mapper.AuditMapper;
import com.bluelogistic.repository.AuditLogRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final AuditMapper auditMapper;
    private final ObjectMapper objectMapper;

    @Async
    @Transactional
    public void logAction(UUID userId, String userEmail, AuditAction action,
                          String entityType, UUID entityId, Object oldValue, Object newValue) {
        try {
            String ipAddress = extractIpAddress();
            String userAgent = extractUserAgent();

            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .userEmail(userEmail)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .oldValue(serializeToJson(oldValue))
                    .newValue(serializeToJson(newValue))
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .build();

            auditLogRepository.save(auditLog);
            log.debug("Audit log created: action={}, entityType={}, entityId={}", action, entityType, entityId);
        } catch (Exception e) {
            log.error("Failed to create audit log: action={}, entityType={}, entityId={}",
                    action, entityType, entityId, e);
        }
    }

    @Async
    @Transactional
    public void logLogin(UUID userId, String userEmail, boolean success) {
        try {
            AuditAction action = success ? AuditAction.LOGIN : AuditAction.LOGIN_FAILED;
            String ipAddress = extractIpAddress();
            String userAgent = extractUserAgent();

            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .userEmail(userEmail)
                    .action(action)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .build();

            auditLogRepository.save(auditLog);
            log.debug("Login audit log created: email={}, success={}", userEmail, success);
        } catch (Exception e) {
            log.error("Failed to create login audit log: email={}", userEmail, e);
        }
    }

    @Async
    @Transactional
    public void logLogout(UUID userId, String userEmail) {
        try {
            String ipAddress = extractIpAddress();
            String userAgent = extractUserAgent();

            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .userEmail(userEmail)
                    .action(AuditAction.LOGOUT)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .build();

            auditLogRepository.save(auditLog);
            log.debug("Logout audit log created: email={}", userEmail);
        } catch (Exception e) {
            log.error("Failed to create logout audit log: email={}", userEmail, e);
        }
    }

    @Async
    @Transactional
    public void logPasswordChange(UUID userId, String userEmail) {
        try {
            String ipAddress = extractIpAddress();
            String userAgent = extractUserAgent();

            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .userEmail(userEmail)
                    .action(AuditAction.PASSWORD_CHANGE)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .build();

            auditLogRepository.save(auditLog);
            log.debug("Password change audit log created: email={}", userEmail);
        } catch (Exception e) {
            log.error("Failed to create password change audit log: email={}", userEmail, e);
        }
    }

    public Page<AuditLogResponse> getAuditLogs(UUID userId, AuditAction action, String entityType,
                                                Instant startDate, Instant endDate, Pageable pageable) {
        return auditLogRepository.findWithFilters(userId, action, entityType, startDate, endDate, pageable)
                .map(auditMapper::toResponse);
    }

    public List<AuditLogResponse> getEntityHistory(String entityType, UUID entityId) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(entityType, entityId)
                .stream()
                .map(auditMapper::toResponse)
                .toList();
    }

    public long countFailedLoginsByIpSince(String ipAddress, Instant since) {
        return auditLogRepository.countFailedLoginsByIpSince(AuditAction.LOGIN_FAILED, ipAddress, since);
    }

    private String extractIpAddress() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                    return xForwardedFor.split(",")[0].trim();
                }
                return request.getRemoteAddr();
            }
        } catch (Exception e) {
            log.debug("Could not extract IP address", e);
        }
        return null;
    }

    private String extractUserAgent() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                return attrs.getRequest().getHeader("User-Agent");
            }
        } catch (Exception e) {
            log.debug("Could not extract User-Agent", e);
        }
        return null;
    }

    private String serializeToJson(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize value to JSON", e);
            return value.toString();
        }
    }
}
