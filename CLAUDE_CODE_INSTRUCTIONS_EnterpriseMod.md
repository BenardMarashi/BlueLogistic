# Claude Code Implementation Instructions

## ⚠️ CRITICAL RULES - READ FIRST

1. **ONLY implement what is explicitly listed in this document**
2. **DO NOT modify, refactor, or "improve" any existing code**
3. **DO NOT change existing file structures or naming conventions**
4. **DO NOT add features not listed here**
5. **Follow the existing code style and patterns already in the project**
6. **Create NEW files only - do not edit existing files unless specifically instructed**
7. **If integration with existing code is needed, add minimal code to existing files**
8. **Test each phase before moving to the next**

---

# Phase 1: Security Foundation

## 1.1 Audit Logging System

### What to Create

Create a complete audit logging system with these NEW files:

**Entity:**
- `AuditLog.java` entity with fields: id (UUID), userId, userEmail, action (enum), entityType, entityId, oldValue (JSON string), newValue (JSON string), ipAddress, userAgent, timestamp, correlationId
- Make the entity immutable (audit logs should never be modified)
- Add database indexes on: userId, entityType, entityId, timestamp, action

**Enum:**
- `AuditAction.java` enum with values: CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, LOGIN_FAILED, PASSWORD_CHANGE, STATUS_CHANGE, EXPORT

**Repository:**
- `AuditLogRepository.java` with methods to query by: userId, entityType+entityId, action, timestamp range
- Add method to count failed logins by IP address since a given time

**Service:**
- `AuditService.java` that:
  - Logs actions asynchronously (don't block main thread)
  - Extracts IP address from request (handle X-Forwarded-For header)
  - Serializes old/new values to JSON
  - Never throws exceptions (logging failures should not break main flow)

**Controller:**
- `AuditController.java` (Admin only) with endpoints:
  - `GET /api/v1/audit` - paginated audit logs with filters
  - `GET /api/v1/audit/entity/{entityType}/{entityId}` - history for specific entity

**DTO:**
- `AuditLogResponse.java` record for API responses

**Mapper:**
- `AuditMapper.java` to convert entity to response

### Integration Points (minimal changes to existing files)
- Add `AuditService` calls to `PackageService` for: create, update, delete, status change
- Add `AuditService` calls to `SellerService` for: create, update, deactivate
- Add `AuditService` calls to `AuthService` for: login, logout, login failed, password change

---

## 1.2 Rate Limiting

### What to Create

**Dependencies to add to pom.xml:**
- bucket4j-core
- bucket4j-redis (or bucket4j-jcache for simpler setup)
- spring-boot-starter-data-redis

**Configuration:**
- `RateLimitConfig.java` with bucket configurations:
  - Default: 100 requests per minute
  - Login endpoint: 5 attempts per 15 minutes
  - Package creation: 50 per hour

**Filter:**
- `RateLimitFilter.java` that:
  - Runs before authentication
  - Uses user ID if authenticated, IP address if not
  - Returns 429 Too Many Requests with retry-after header
  - Adds X-Rate-Limit-Remaining header to responses
  - Skips rate limiting for /actuator/* and /swagger/* paths

**Properties to add to application.yml:**
- Redis connection settings
- Rate limit values (make configurable)

---

## 1.3 Correlation IDs

### What to Create

**Component:**
- `CorrelationIdHolder.java` - ThreadLocal holder for correlation ID

**Filter:**
- `CorrelationIdFilter.java` that:
  - Runs first (highest precedence)
  - Reads X-Correlation-ID header or generates UUID
  - Stores in CorrelationIdHolder and MDC
  - Adds correlation ID to response header
  - Cleans up after request

**Filter:**
- `RequestLoggingFilter.java` that:
  - Logs: method, URI, status, duration, IP, user, request body (masked), response body on errors
  - Masks sensitive fields: password, token, secret, apiKey
  - Truncates long bodies

**Update logback-spring.xml:**
- Add correlationId to log pattern: `%d{ISO8601} [%X{correlationId}] %-5level %logger{36} - %msg%n`

---

## 1.4 API Versioning

### What to Change

**Controllers:**
- Change all endpoint mappings from `/api/` to `/api/v1/`
- Example: `/api/packages` becomes `/api/v1/packages`

**Security Config:**
- Update security patterns to include `/api/v1/**`

**Documentation:**
- Update any API documentation with new paths

---

# Phase 2: Operational Readiness

## 2.1 Health Checks & Monitoring

### What to Create

**Dependencies to add to pom.xml:**
- spring-boot-starter-actuator
- micrometer-registry-prometheus

**Configuration in application.yml:**
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when_authorized
      probes:
        enabled: true
  health:
    db:
      enabled: true
    diskspace:
      enabled: true
```

**Custom Health Indicator:**
- `DatabaseHealthIndicator.java` - checks database connectivity
- `DiskSpaceHealthIndicator.java` - checks available disk space

**Custom Metrics:**
- `PackageMetrics.java` that tracks:
  - packages_created_total (counter)
  - packages_by_status (gauge)
  - package_status_change_duration (timer)

---

## 2.2 Structured JSON Logging

### What to Create

**Dependencies to add to pom.xml:**
- logstash-logback-encoder

**Create logback-spring.xml:**
- JSON format for production profile
- Console format for development profile
- Include: timestamp, level, logger, message, correlationId, userId, exception

---

## 2.3 Soft Delete

### What to Change (minimal modifications)

**Add to existing entities (Package, Seller, User):**
- `deleted` boolean field (default false)
- `deletedAt` Instant field (nullable)
- `deletedBy` UUID field (nullable)

**Add to existing repositories:**
- Modify default queries to exclude deleted records
- Add methods to find deleted records (for admin recovery)

**Add to existing services:**
- Change delete methods to set deleted=true instead of removing
- Add restore methods for admins

**Create NEW:**
- `SoftDeleteAspect.java` - AOP aspect to automatically filter deleted records (optional, can use @Where annotation instead)

---

## 2.4 Database Migrations (Flyway)

### What to Create

**Dependencies to add to pom.xml:**
- flyway-core
- flyway-database-postgresql

**Configuration in application.yml:**
```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
```

**Migration files in src/main/resources/db/migration/:**
- `V1__initial_schema.sql` - existing tables
- `V2__add_audit_log_table.sql` - audit log table
- `V3__add_soft_delete_columns.sql` - soft delete fields
- `V4__add_user_tracking_columns.sql` - lastLoginAt, loginCount, failedLoginAttempts

---

# Phase 3: Business Features

## 3.1 Email Notifications

### What to Create

**Dependencies to add to pom.xml:**
- spring-boot-starter-mail

**Configuration:**
- `MailConfig.java` with JavaMailSender bean

**Service:**
- `EmailService.java` with methods:
  - sendStatusChangeNotification(Package pkg, PackageStatus oldStatus)
  - sendTrackingNumberNotification(Package pkg)
  - sendWelcomeEmail(User user)
  - sendPasswordResetEmail(User user, String resetToken)

**Templates in src/main/resources/templates/email/:**
- `status-change.html`
- `tracking-number.html`
- `welcome.html`
- `password-reset.html`

**Async Configuration:**
- `AsyncConfig.java` to enable @Async for email sending

**Properties to add to application.yml:**
- SMTP settings (host, port, username, password)
- From address

### Integration Points
- Call EmailService from PackageService on status change
- Call EmailService from PackageService when tracking number added
- Call EmailService from AuthService on user creation

---

## 3.2 Export/Reporting

### What to Create

**Dependencies to add to pom.xml:**
- Apache POI (for Excel)
- OpenCSV (for CSV)

**Service:**
- `ExportService.java` with methods:
  - exportPackagesToCsv(filters, outputStream)
  - exportPackagesToExcel(filters, outputStream)
  - generatePackageSummaryReport(dateRange)

**Controller:**
- `ExportController.java` with endpoints:
  - `GET /api/v1/export/packages/csv` - CSV export
  - `GET /api/v1/export/packages/excel` - Excel export
  - `GET /api/v1/reports/packages/summary` - Summary stats

**DTOs:**
- `PackageSummaryReport.java` - statistics record
- `ExportFilters.java` - filter parameters

---

## 3.3 Standardized Error Codes

### What to Create

**Enum:**
- `ErrorCode.java` with categorized codes:
  - AUTH-001: Invalid credentials
  - AUTH-002: Token expired
  - AUTH-003: Account locked
  - PKG-001: Package not found
  - PKG-002: Invalid status transition
  - PKG-003: Invalid tracking number
  - SELL-001: Seller not found
  - SELL-002: Seller deactivated
  - VAL-001: Validation error
  - RATE-001: Rate limit exceeded
  - SYS-001: Internal server error

**DTO:**
- `ErrorResponse.java` record with: code, message, details, timestamp, correlationId, field (for validation)

**Update GlobalExceptionHandler.java:**
- Return ErrorResponse with appropriate ErrorCode for each exception type
- Include correlation ID in all error responses

---

## 3.4 API Documentation (OpenAPI/Swagger)

### What to Create

**Dependencies to add to pom.xml:**
- springdoc-openapi-starter-webmvc-ui

**Configuration:**
- `OpenApiConfig.java` with API info, security schemes, tags

**Add to Controllers:**
- @Operation annotations on each endpoint
- @ApiResponse annotations for response codes
- @Parameter annotations for parameters
- @Tag annotations for grouping

**Properties to add to application.yml:**
```yaml
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    operationsSorter: method
```

---

# Phase 4: Production Hardening

## 4.1 Docker Configuration

### What to Create

**Dockerfile:**
- Multi-stage build
- Use Eclipse Temurin JDK 21
- Non-root user
- Health check
- Proper ENTRYPOINT with JVM flags

**docker-compose.yml:**
- App service
- PostgreSQL service
- Redis service (for rate limiting)
- Network configuration
- Volume mounts for data persistence

**.dockerignore:**
- Exclude unnecessary files

---

## 4.2 Secrets Management

### What to Create

**Configuration:**
- `SecretsConfig.java` - for loading secrets from environment or vault

**Update application.yml:**
- Use environment variables for all secrets: ${DB_PASSWORD}, ${JWT_SECRET}, ${SMTP_PASSWORD}
- Document all required environment variables

**Create:**
- `.env.example` - template with all required variables (no actual values)
- `secrets.md` - documentation on how to set up secrets

---

## 4.3 Session/Token Management

### What to Create

**Entity:**
- `RefreshToken.java` with: id, userId, token, expiresAt, createdAt, revoked

**Repository:**
- `RefreshTokenRepository.java`

**Update JwtTokenProvider.java:**
- Add refresh token generation
- Add method to validate and rotate refresh tokens

**Update AuthController.java:**
- Add `POST /api/v1/auth/refresh` endpoint
- Update logout to revoke refresh tokens

**Add to User entity:**
- `lastLoginAt` Instant field
- `loginCount` int field
- `failedLoginAttempts` int field
- `lockedUntil` Instant field (nullable)

**Service updates:**
- Implement account lockout after 5 failed attempts
- Track login statistics

---

## 4.4 CORS Configuration

### What to Create

**Configuration:**
- `CorsConfig.java` with:
  - Configurable allowed origins (from properties)
  - Allowed methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
  - Allowed headers: Authorization, Content-Type, X-Correlation-ID
  - Exposed headers: X-Correlation-ID, X-Rate-Limit-Remaining
  - Max age: 3600

**Properties to add to application.yml:**
```yaml
app:
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000}
```

---

## 4.5 Graceful Shutdown

### What to Add to application.yml

```yaml
server:
  shutdown: graceful

spring:
  lifecycle:
    timeout-per-shutdown-phase: 30s
```

### What to Create

**Component:**
- `GracefulShutdownHandler.java` that:
  - Completes in-flight requests
  - Closes database connections properly
  - Logs shutdown progress

---

# Checklist Before Starting Each Phase

Before implementing any phase:

1. [ ] Read existing code in related areas
2. [ ] Understand current patterns and conventions
3. [ ] Create a new git branch for the phase
4. [ ] Implement only what's listed
5. [ ] Write tests for new functionality
6. [ ] Test integration with existing features
7. [ ] Do not modify unrelated code
8. [ ] Commit with clear messages

---

# File Naming Conventions (Follow Existing)

- Entities: `{Name}.java` in `entity/` package
- Repositories: `{Name}Repository.java` in `repository/` package
- Services: `{Name}Service.java` interface + `{Name}ServiceImpl.java` in `service/` package
- Controllers: `{Name}Controller.java` in `controller/` package
- DTOs: `{Name}Request.java` or `{Name}Response.java` in `dto/request/` or `dto/response/`
- Config: `{Name}Config.java` in `config/` package
- Filters: `{Name}Filter.java` in `filter/` or `security/` package

---

# Order of Implementation

Complete each phase fully before moving to the next:

1. **Phase 1** → Test all security features work
2. **Phase 2** → Verify monitoring and logging work
3. **Phase 3** → Test business features end-to-end
4. **Phase 4** → Deploy to staging and verify

---

# What NOT to Do

❌ Do not refactor existing code "while you're in there"
❌ Do not upgrade dependencies unless required for new features
❌ Do not change database column names or types
❌ Do not modify existing API response formats
❌ Do not add optional "nice to have" features
❌ Do not change authentication flow unless specified
❌ Do not modify frontend code (this is backend only)
❌ Do not create abstract base classes unless absolutely necessary
❌ Do not add lombok annotations to existing classes
❌ Do not change existing package structure
