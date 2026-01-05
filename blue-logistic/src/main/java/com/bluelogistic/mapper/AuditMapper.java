package com.bluelogistic.mapper;

import com.bluelogistic.dto.AuditLogResponse;
import com.bluelogistic.entity.AuditLog;
import org.springframework.stereotype.Component;

@Component
public class AuditMapper {

    public AuditLogResponse toResponse(AuditLog auditLog) {
        return new AuditLogResponse(
                auditLog.getId(),
                auditLog.getUserId(),
                auditLog.getUserEmail(),
                auditLog.getAction(),
                auditLog.getEntityType(),
                auditLog.getEntityId(),
                auditLog.getOldValue(),
                auditLog.getNewValue(),
                auditLog.getIpAddress(),
                auditLog.getUserAgent(),
                auditLog.getTimestamp(),
                auditLog.getCorrelationId()
        );
    }
}
