package com.bluelogistic.entity;

import com.bluelogistic.entity.enums.AuditAction;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_logs", indexes = {
        @Index(name = "idx_audit_user_id", columnList = "userId"),
        @Index(name = "idx_audit_entity_type", columnList = "entityType"),
        @Index(name = "idx_audit_entity_id", columnList = "entityId"),
        @Index(name = "idx_audit_timestamp", columnList = "timestamp"),
        @Index(name = "idx_audit_action", columnList = "action")
})
@Getter
@NoArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = true)
    private UUID userId;

    @Column(nullable = true)
    private String userEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action;

    @Column(nullable = true)
    private String entityType;

    @Column(nullable = true)
    private UUID entityId;

    @Column(columnDefinition = "TEXT")
    private String oldValue;

    @Column(columnDefinition = "TEXT")
    private String newValue;

    @Column(nullable = true)
    private String ipAddress;

    @Column(nullable = true)
    private String userAgent;

    @Column(nullable = false)
    private Instant timestamp;

    @Column(nullable = true)
    private String correlationId;

    private AuditLog(Builder builder) {
        this.userId = builder.userId;
        this.userEmail = builder.userEmail;
        this.action = builder.action;
        this.entityType = builder.entityType;
        this.entityId = builder.entityId;
        this.oldValue = builder.oldValue;
        this.newValue = builder.newValue;
        this.ipAddress = builder.ipAddress;
        this.userAgent = builder.userAgent;
        this.timestamp = Instant.now();
        this.correlationId = builder.correlationId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID userId;
        private String userEmail;
        private AuditAction action;
        private String entityType;
        private UUID entityId;
        private String oldValue;
        private String newValue;
        private String ipAddress;
        private String userAgent;
        private String correlationId;

        public Builder userId(UUID userId) {
            this.userId = userId;
            return this;
        }

        public Builder userEmail(String userEmail) {
            this.userEmail = userEmail;
            return this;
        }

        public Builder action(AuditAction action) {
            this.action = action;
            return this;
        }

        public Builder entityType(String entityType) {
            this.entityType = entityType;
            return this;
        }

        public Builder entityId(UUID entityId) {
            this.entityId = entityId;
            return this;
        }

        public Builder oldValue(String oldValue) {
            this.oldValue = oldValue;
            return this;
        }

        public Builder newValue(String newValue) {
            this.newValue = newValue;
            return this;
        }

        public Builder ipAddress(String ipAddress) {
            this.ipAddress = ipAddress;
            return this;
        }

        public Builder userAgent(String userAgent) {
            this.userAgent = userAgent;
            return this;
        }

        public Builder correlationId(String correlationId) {
            this.correlationId = correlationId;
            return this;
        }

        public AuditLog build() {
            return new AuditLog(this);
        }
    }
}
