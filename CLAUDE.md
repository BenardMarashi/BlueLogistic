# CLAUDE.md - BlueLogistic Development Guide

## 🎯 Project Purpose
Package Management Platform for logistics company with multiple sellers.

## 📁 Base Path
All code goes in: `src/main/java/com/bluelogistic/`

## ⚡ Quick Rules

### ALWAYS DO
- Use Java Records for DTOs
- Use `@RequiredArgsConstructor` for dependency injection
- Use `@Transactional(readOnly = true)` on service classes
- Use `@Transactional` on methods that write data
- Use `FetchType.LAZY` for all relationships
- Use `@Enumerated(EnumType.STRING)` for enums
- Validate all request DTOs with jakarta.validation
- Return proper HTTP status codes (201 for POST, 204 for DELETE)
- Log business events with SLF4J `@Slf4j`

### NEVER DO
- Put business logic in controllers
- Return entities from controllers (use DTOs)
- Use `@Data` on JPA entities
- Use `@Autowired` field injection
- Use `FetchType.EAGER`
- Ignore exceptions
- Log passwords or tokens
- Add features not in requirements

## 📏 File Line Limits

| Type | Max Lines |
|------|-----------|
| Controllers | 100 |
| Services | 200 |
| Entities | 100 |
| DTOs (Records) | 35 |
| Repositories | 80 |
| Mappers | 70 |
| Config | 100 |
| Exceptions | 15 |

## 🏗️ Layer Dependencies

```
Controller → Service → Repository
     ↓          ↓
    DTO      Entity
     ↑          ↓
   Mapper ←────┘
```

## 📋 Entity Relationships

```
User (1) ←——— (1) Seller (1) ←——— (N) Package
```

## 🔐 Security Rules

| Endpoint | Role |
|----------|------|
| POST /api/auth/login | Public |
| GET /api/auth/me | Authenticated |
| PATCH /api/auth/password | Authenticated |
| GET /api/packages | Authenticated (filtered by role) |
| POST /api/packages | SELLER only |
| PATCH /api/packages/{id}/status | ADMIN only |
| PATCH /api/packages/{id}/tracking | ADMIN only |
| DELETE /api/packages/{id} | ADMIN only |
| /api/sellers/** | ADMIN only |

## 📦 Status Workflow

```
CREATED → IN_STORAGE → DISPATCHED
```
- Seller creates package → CREATED
- Admin receives → IN_STORAGE
- Admin ships + adds tracking → DISPATCHED

## 🔧 Commands

```bash
# Compile
./mvnw clean compile

# Run tests
./mvnw test

# Start dev server
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Package
./mvnw clean package -DskipTests
```

## 📝 Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Package | singular | `controller`, not `controllers` |
| Entity | PascalCase | `Package`, `User` |
| DTO | PascalCase + suffix | `CreatePackageRequest`, `PackageResponse` |
| Service | PascalCase + Service | `PackageService` |
| Controller | PascalCase + Controller | `PackageController` |
| Repository | PascalCase + Repository | `PackageRepository` |

## 🧪 Test Naming

Pattern: `methodName_condition_expectedResult`

```java
void create_ValidRequest_ReturnsPackageResponse()
void getById_NotFound_ThrowsException()
void updateStatus_InvalidTransition_ThrowsException()
```

## ⚠️ Common Mistakes to Avoid

1. **N+1 Queries**: Use `JOIN FETCH` or `@EntityGraph`
2. **Missing Transactions**: Always use `@Transactional` for writes
3. **Validation Bypass**: Always use `@Valid` on `@RequestBody`
4. **Wrong Status Code**: POST=201, DELETE=204, GET/PUT/PATCH=200
5. **Entity Exposure**: Never return entities, always use DTOs

## 📚 Key Dependencies

```xml
<!-- Already in pom.xml -->
spring-boot-starter-web
spring-boot-starter-data-jpa
spring-boot-starter-security
spring-boot-starter-validation
postgresql
lombok

<!-- Need to add -->
jjwt-api (0.12.6)
jjwt-impl (0.12.6)
jjwt-jackson (0.12.6)
flyway-core
flyway-database-postgresql
```

## 🎯 Definition of Done

- [ ] Code compiles without errors
- [ ] All endpoints return correct responses
- [ ] Authentication works (JWT)
- [ ] Role-based access control works
- [ ] Validation errors return 400 with details
- [ ] Database migrations run successfully
- [ ] No file exceeds line limits
- [ ] All business logic in services (not controllers)
