# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
BlueLogistic is a package management platform for logistics companies with multiple sellers. The system consists of a Spring Boot backend (Java 21) and Next.js frontend (TypeScript + React).

**Repository Structure:**
- `blue-logistic/` - Spring Boot backend API
- `blue-logistic-frontend/` - Next.js frontend application
- Backend base path: `src/main/java/com/bluelogistic/`

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

## Development Commands

### Backend (Spring Boot)
Working directory: `blue-logistic/`

```bash
# Compile
./mvnw clean compile

# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=PackageServiceTest

# Run specific test method
./mvnw test -Dtest=PackageServiceTest#create_ValidRequest_ReturnsPackageResponse

# Start dev server (uses application-dev.yml profile)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Package for production
./mvnw clean package -DskipTests
```

### Frontend (Next.js)
Working directory: `blue-logistic-frontend/`

```bash
# Install dependencies
npm install

# Run dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
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

## Architecture Details

### Backend Package Structure
```
src/main/java/com/bluelogistic/
├── config/          # SecurityConfig, JwtAuthenticationFilter, PasswordEncoderConfig
├── controller/      # AuthController, PackageController, SellerController
├── dto/             # Request/Response records (e.g., CreatePackageRequest, PackageResponse)
├── entity/          # JPA entities: User, Seller, Package
│   └── enums/       # PackageStatus, UserRole
├── exception/       # BusinessException, ResourceNotFoundException, InvalidStatusTransitionException
├── mapper/          # Entity ↔ DTO conversion (PackageMapper, SellerMapper, UserMapper)
├── repository/      # Spring Data JPA repositories with custom queries
└── service/         # Business logic: AuthService, PackageService, SellerService, JwtService
```

### Authentication & Authorization
- **JWT-based authentication** using Spring Security
- **UserDetailsService** implementation loads users from database
- **JwtAuthenticationFilter** validates tokens on every request
- **Method-level security** via `@PreAuthorize` annotations in controllers
- **Password encoding** uses BCryptPasswordEncoder
- **Default admin account:** admin@bluelogistic.com / admin123 (created via Flyway migration V4)

### Database Management
- **Flyway migrations** in `src/main/resources/db/migration/`
- Migration naming: `V{version}__{description}.sql` (e.g., V1__create_users_table.sql)
- **H2 in-memory database** used for tests (automatically configured in test profile)
- **PostgreSQL** for dev/prod environments
- Entities use UUID primary keys with `@GeneratedValue(strategy = GenerationType.UUID)`
- Automatic timestamp management via `@PrePersist` and `@PreUpdate` lifecycle callbacks

### Key Dependencies
- Spring Boot 3.5.9, Java 21
- Spring Data JPA + Hibernate
- Spring Security + JWT (jjwt 0.12.6)
- PostgreSQL + Flyway
- Lombok for boilerplate reduction
- Jakarta Validation for DTO validation

### Testing Strategy
- Service layer tests use Mockito to mock repositories
- Test naming: `methodName_condition_expectedResult`
- Tests run against H2 in-memory database
- Use `@ExtendWith(MockitoExtension.class)` for unit tests
