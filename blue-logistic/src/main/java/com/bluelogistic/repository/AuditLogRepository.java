package com.bluelogistic.repository;

import com.bluelogistic.entity.AuditLog;
import com.bluelogistic.entity.enums.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    Page<AuditLog> findByUserId(UUID userId, Pageable pageable);

    Page<AuditLog> findByEntityTypeAndEntityId(String entityType, UUID entityId, Pageable pageable);

    Page<AuditLog> findByAction(AuditAction action, Pageable pageable);

    Page<AuditLog> findByTimestampBetween(Instant start, Instant end, Pageable pageable);

    @Query(value = "SELECT * FROM audit_logs a WHERE " +
            "(CAST(:userId AS UUID) IS NULL OR a.user_id = CAST(:userId AS UUID)) AND " +
            "(CAST(:action AS VARCHAR) IS NULL OR a.action = CAST(:action AS VARCHAR)) AND " +
            "(CAST(:entityType AS VARCHAR) IS NULL OR a.entity_type = CAST(:entityType AS VARCHAR)) AND " +
            "(CAST(:startDate AS TIMESTAMP) IS NULL OR a.timestamp >= CAST(:startDate AS TIMESTAMP)) AND " +
            "(CAST(:endDate AS TIMESTAMP) IS NULL OR a.timestamp <= CAST(:endDate AS TIMESTAMP)) " +
            "ORDER BY a.timestamp DESC",
            countQuery = "SELECT COUNT(*) FROM audit_logs a WHERE " +
            "(CAST(:userId AS UUID) IS NULL OR a.user_id = CAST(:userId AS UUID)) AND " +
            "(CAST(:action AS VARCHAR) IS NULL OR a.action = CAST(:action AS VARCHAR)) AND " +
            "(CAST(:entityType AS VARCHAR) IS NULL OR a.entity_type = CAST(:entityType AS VARCHAR)) AND " +
            "(CAST(:startDate AS TIMESTAMP) IS NULL OR a.timestamp >= CAST(:startDate AS TIMESTAMP)) AND " +
            "(CAST(:endDate AS TIMESTAMP) IS NULL OR a.timestamp <= CAST(:endDate AS TIMESTAMP))",
            nativeQuery = true)
    Page<AuditLog> findWithFilters(
            @Param("userId") UUID userId,
            @Param("action") AuditAction action,
            @Param("entityType") String entityType,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            Pageable pageable
    );

    List<AuditLog> findByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, UUID entityId);

    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.action = :action AND a.ipAddress = :ipAddress AND a.timestamp >= :since")
    long countFailedLoginsByIpSince(
            @Param("action") AuditAction action,
            @Param("ipAddress") String ipAddress,
            @Param("since") Instant since
    );
}
