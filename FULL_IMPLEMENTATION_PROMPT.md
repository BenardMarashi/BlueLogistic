# BlueLogistic - Complete Implementation Prompt

## 🎯 Mission

Build a **Package Management Platform** for a logistics company. The platform allows:
- **Sellers** to create packages with customer details
- **Admins** to manage package status and tracking numbers

---

## 📋 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Java 21 + Spring Boot 3.5.9 |
| Database | PostgreSQL |
| ORM | Spring Data JPA + Hibernate |
| Auth | Spring Security + JWT |
| Migrations | Flyway |
| Build | Maven |

---

## 🗂️ Project Structure

```
blue-logistic/
├── pom.xml
├── src/main/java/com/bluelogistic/
│   ├── BlueLogisticApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JpaConfig.java
│   │   └── CorsConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── SellerController.java
│   │   ├── PackageController.java
│   │   └── GlobalExceptionHandler.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── JwtService.java
│   │   ├── SellerService.java
│   │   └── PackageService.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── SellerRepository.java
│   │   └── PackageRepository.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── Seller.java
│   │   ├── Package.java
│   │   └── enums/
│   │       ├── Role.java
│   │       └── PackageStatus.java
│   ├── dto/
│   │   ├── request/
│   │   │   ├── LoginRequest.java
│   │   │   ├── ChangePasswordRequest.java
│   │   │   ├── CreatePackageRequest.java
│   │   │   ├── CreateSellerRequest.java
│   │   │   ├── UpdateStatusRequest.java
│   │   │   ├── UpdateTrackingRequest.java
│   │   │   └── UpdateSellerRequest.java
│   │   └── response/
│   │       ├── LoginResponse.java
│   │       ├── UserResponse.java
│   │       ├── PackageResponse.java
│   │       ├── SellerResponse.java
│   │       ├── PageResponse.java
│   │       └── ErrorResponse.java
│   ├── mapper/
│   │   ├── UserMapper.java
│   │   ├── SellerMapper.java
│   │   └── PackageMapper.java
│   └── exception/
│       ├── GlobalExceptionHandler.java
│       ├── ResourceNotFoundException.java
│       ├── UnauthorizedException.java
│       ├── BusinessException.java
│       └── DuplicateResourceException.java
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   └── db/migration/
│       ├── V1__create_users_table.sql
│       ├── V2__create_sellers_table.sql
│       ├── V3__create_packages_table.sql
│       └── V4__insert_admin_user.sql
└── src/test/java/com/bluelogistic/
    ├── BlueLogisticApplicationTests.java
    ├── controller/
    │   ├── AuthControllerTest.java
    │   ├── SellerControllerTest.java
    │   └── PackageControllerTest.java
    └── service/
        ├── AuthServiceTest.java
        ├── SellerServiceTest.java
        └── PackageServiceTest.java
```

---

## 📊 Data Model

### User Entity
```
User
├── id: UUID (PK)
├── email: String (unique, not null)
├── passwordHash: String (not null)
├── name: String (not null)
├── role: Enum [ADMIN, SELLER] (not null)
├── createdAt: DateTime
└── updatedAt: DateTime
```

### Seller Entity
```
Seller
├── id: UUID (PK)
├── userId: UUID (FK → User, unique)
├── companyName: String (not null)
├── isActive: Boolean (default: true)
├── createdAt: DateTime
└── updatedAt: DateTime
```

### Package Entity
```
Package
├── id: UUID (PK)
├── sellerId: UUID (FK → Seller)
├── customerName: String (not null)
├── customerAddress: String (not null)
├── customerPostal: String (not null)
├── customerCity: String (not null)
├── customerPhone: String (not null)
├── customerEmail: String (nullable)
├── weight: Decimal (not null)
├── status: Enum [CREATED, IN_STORAGE, DISPATCHED]
├── trackingNumber: String (nullable, unique)
├── createdAt: DateTime
├── receivedAt: DateTime (nullable)
├── dispatchedAt: DateTime (nullable)
└── updatedAt: DateTime
```

---

## 🔐 Security & Roles

| Role | Permissions |
|------|-------------|
| **ADMIN** | All operations, manage sellers, update package status/tracking |
| **SELLER** | Create packages, view own packages only |

### Status Workflow
```
CREATED ──────► IN_STORAGE ──────► DISPATCHED
(Seller         (Admin             (Admin ships +
creates)        receives)          adds tracking)
```

**Rules:**
- Only forward transitions allowed
- Tracking number can be added in IN_STORAGE or DISPATCHED
- Only CREATED packages can be deleted

---

## 🔌 API Specification

### Authentication Endpoints

#### POST /api/auth/login
**Access:** Public
```json
// Request
{
  "email": "admin@bluelogistic.com",
  "password": "admin123"
}

// Response 200
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "email": "admin@bluelogistic.com",
  "name": "System Administrator",
  "role": "ADMIN"
}

// Response 401
{
  "status": 401,
  "message": "Invalid email or password",
  "timestamp": "2025-01-15T10:30:00"
}
```

#### GET /api/auth/me
**Access:** Authenticated
```json
// Response 200
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "email": "admin@bluelogistic.com",
  "name": "System Administrator",
  "role": "ADMIN",
  "createdAt": "2025-01-01T00:00:00",
  "updatedAt": "2025-01-01T00:00:00"
}
```

#### PATCH /api/auth/password
**Access:** Authenticated
```json
// Request
{
  "currentPassword": "admin123",
  "newPassword": "newSecure123"
}

// Response 204 (No Content)
```

---

### Seller Endpoints (Admin Only)

#### GET /api/sellers
**Access:** Admin
```json
// Query params: ?page=0&size=20&sort=createdAt,desc

// Response 200
{
  "content": [
    {
      "id": "seller-uuid-1",
      "userId": "user-uuid-1",
      "name": "John Doe",
      "email": "john@shop.com",
      "companyName": "John's Electronics",
      "isActive": true,
      "packageCount": 15,
      "createdAt": "2025-01-10T10:00:00",
      "updatedAt": "2025-01-10T10:00:00"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1
}
```

#### GET /api/sellers/{id}
**Access:** Admin
```json
// Response 200
{
  "id": "seller-uuid-1",
  "userId": "user-uuid-1",
  "name": "John Doe",
  "email": "john@shop.com",
  "companyName": "John's Electronics",
  "isActive": true,
  "packageCount": 15,
  "createdAt": "2025-01-10T10:00:00",
  "updatedAt": "2025-01-10T10:00:00"
}

// Response 404
{
  "status": 404,
  "message": "Seller not found with id: seller-uuid-1",
  "timestamp": "2025-01-15T10:30:00"
}
```

#### POST /api/sellers
**Access:** Admin
```json
// Request
{
  "name": "Jane Smith",
  "email": "jane@fashion.com",
  "password": "secure123",
  "companyName": "Jane's Fashion"
}

// Response 201
{
  "id": "new-seller-uuid",
  "userId": "new-user-uuid",
  "name": "Jane Smith",
  "email": "jane@fashion.com",
  "companyName": "Jane's Fashion",
  "isActive": true,
  "packageCount": 0,
  "createdAt": "2025-01-15T10:30:00",
  "updatedAt": "2025-01-15T10:30:00"
}

// Response 409 (Duplicate email)
{
  "status": 409,
  "message": "Email already exists: jane@fashion.com",
  "timestamp": "2025-01-15T10:30:00"
}
```

#### PATCH /api/sellers/{id}
**Access:** Admin
```json
// Request
{
  "companyName": "Jane's Fashion Updated",
  "isActive": false
}

// Response 200
{
  "id": "seller-uuid-1",
  "userId": "user-uuid-1",
  "name": "Jane Smith",
  "email": "jane@fashion.com",
  "companyName": "Jane's Fashion Updated",
  "isActive": false,
  "packageCount": 15,
  "createdAt": "2025-01-10T10:00:00",
  "updatedAt": "2025-01-15T10:35:00"
}
```

#### GET /api/sellers/{id}/packages
**Access:** Admin
```json
// Query params: ?page=0&size=20&status=CREATED&search=john

// Response 200 (same as GET /api/packages but filtered by seller)
```

---

### Package Endpoints

#### GET /api/packages
**Access:** Authenticated (role-filtered)
- Admin sees all packages
- Seller sees only their own packages

```json
// Query params: ?page=0&size=20&status=IN_STORAGE&sellerId=uuid&search=customer

// Response 200
{
  "content": [
    {
      "id": "package-uuid-1",
      "sellerId": "seller-uuid-1",
      "sellerCompanyName": "John's Electronics",
      "customerName": "Alice Brown",
      "customerAddress": "123 Main St",
      "customerPostal": "1010",
      "customerCity": "Vienna",
      "customerPhone": "+43123456789",
      "customerEmail": "alice@email.com",
      "weight": 2.5,
      "status": "CREATED",
      "trackingNumber": null,
      "createdAt": "2025-01-15T09:00:00",
      "receivedAt": null,
      "dispatchedAt": null,
      "updatedAt": "2025-01-15T09:00:00"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1
}
```

#### GET /api/packages/{id}
**Access:** Authenticated (ownership check for sellers)
```json
// Response 200
{
  "id": "package-uuid-1",
  "sellerId": "seller-uuid-1",
  "sellerCompanyName": "John's Electronics",
  "customerName": "Alice Brown",
  "customerAddress": "123 Main St",
  "customerPostal": "1010",
  "customerCity": "Vienna",
  "customerPhone": "+43123456789",
  "customerEmail": "alice@email.com",
  "weight": 2.5,
  "status": "CREATED",
  "trackingNumber": null,
  "createdAt": "2025-01-15T09:00:00",
  "receivedAt": null,
  "dispatchedAt": null,
  "updatedAt": "2025-01-15T09:00:00"
}
```

#### POST /api/packages
**Access:** Seller only
```json
// Request
{
  "customerName": "Bob Wilson",
  "customerAddress": "456 Oak Ave",
  "customerPostal": "1020",
  "customerCity": "Vienna",
  "customerPhone": "+43987654321",
  "customerEmail": "bob@email.com",
  "weight": 1.5
}

// Response 201
{
  "id": "new-package-uuid",
  "sellerId": "current-seller-uuid",
  "sellerCompanyName": "My Shop",
  "customerName": "Bob Wilson",
  "customerAddress": "456 Oak Ave",
  "customerPostal": "1020",
  "customerCity": "Vienna",
  "customerPhone": "+43987654321",
  "customerEmail": "bob@email.com",
  "weight": 1.5,
  "status": "CREATED",
  "trackingNumber": null,
  "createdAt": "2025-01-15T10:30:00",
  "receivedAt": null,
  "dispatchedAt": null,
  "updatedAt": "2025-01-15T10:30:00"
}

// Response 400 (Validation)
{
  "status": 400,
  "message": "Validation failed",
  "errors": [
    "customerName: Customer name is required",
    "weight: Weight must be positive"
  ],
  "timestamp": "2025-01-15T10:30:00"
}
```

#### PATCH /api/packages/{id}/status
**Access:** Admin only
```json
// Request
{
  "status": "IN_STORAGE"
}

// Response 200
{
  "id": "package-uuid-1",
  "status": "IN_STORAGE",
  "receivedAt": "2025-01-15T11:00:00",
  // ... other fields
}

// Response 400 (Invalid transition)
{
  "status": 400,
  "message": "Invalid status transition from DISPATCHED to CREATED",
  "timestamp": "2025-01-15T10:30:00"
}
```

#### PATCH /api/packages/{id}/tracking
**Access:** Admin only
```json
// Request
{
  "trackingNumber": "DPD123456789"
}

// Response 200
{
  "id": "package-uuid-1",
  "trackingNumber": "DPD123456789",
  "status": "DISPATCHED",
  "dispatchedAt": "2025-01-15T12:00:00",
  // ... other fields
}

// Response 400 (Duplicate tracking)
{
  "status": 400,
  "message": "Tracking number already exists",
  "timestamp": "2025-01-15T10:30:00"
}
```

#### DELETE /api/packages/{id}
**Access:** Admin only
```json
// Response 204 (No Content)

// Response 400 (Not CREATED status)
{
  "status": 400,
  "message": "Only packages with CREATED status can be deleted",
  "timestamp": "2025-01-15T10:30:00"
}
```

---

## ✅ Validation Rules

### Package Creation
| Field | Rules |
|-------|-------|
| customerName | Required, 2-100 chars |
| customerAddress | Required, 5-200 chars |
| customerPostal | Required, 4-10 digits |
| customerCity | Required, 2-100 chars |
| customerPhone | Required, valid phone format |
| customerEmail | Optional, valid email format |
| weight | Required, positive, max 1000 kg |

### Seller Creation
| Field | Rules |
|-------|-------|
| name | Required, 2-100 chars |
| companyName | Required, 2-100 chars |
| email | Required, valid email, unique |
| password | Required, min 8 chars |

### Password Change
| Field | Rules |
|-------|-------|
| currentPassword | Required |
| newPassword | Required, min 8 chars |

---

## 📏 File Line Limits

| Category | Max Lines |
|----------|-----------|
| Controllers | 100 |
| Services | 200 |
| Entities | 100 |
| DTOs (Records) | 35 |
| Repositories | 80 |
| Mappers | 70 |
| Config | 100 |
| Exceptions | 15 |

---

## ⚙️ Configuration

### application.yml
```yaml
spring:
  application:
    name: blue-logistic
  profiles:
    active: dev
  jpa:
    open-in-view: false
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        format_sql: true
  flyway:
    enabled: true
    baseline-on-migrate: true

application:
  security:
    jwt:
      secret-key: ${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
      expiration: 86400000  # 24 hours

logging:
  level:
    com.bluelogistic: DEBUG
```

### application-dev.yml
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/bluelogistic
    username: bluelogistic
    password: bluelogistic123
  jpa:
    show-sql: true

logging:
  level:
    org.hibernate.SQL: DEBUG
```

### application-prod.yml
```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    show-sql: false

logging:
  level:
    com.bluelogistic: INFO
    org.hibernate.SQL: WARN
```

---

## 🗃️ Database Migrations

### V1__create_users_table.sql
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### V2__create_sellers_table.sql
```sql
CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sellers_user_id ON sellers(user_id);
CREATE INDEX idx_sellers_is_active ON sellers(is_active);
```

### V3__create_packages_table.sql
```sql
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    customer_name VARCHAR(100) NOT NULL,
    customer_address VARCHAR(200) NOT NULL,
    customer_postal VARCHAR(10) NOT NULL,
    customer_city VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    weight DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CREATED',
    tracking_number VARCHAR(100) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    received_at TIMESTAMP,
    dispatched_at TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_packages_seller_id ON packages(seller_id);
CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_packages_tracking ON packages(tracking_number);
CREATE INDEX idx_packages_created_at ON packages(created_at);
```

### V4__insert_admin_user.sql
```sql
-- Password: admin123 (BCrypt hash)
INSERT INTO users (id, email, password_hash, name, role)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'admin@bluelogistic.com',
    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
    'System Administrator',
    'ADMIN'
);
```

---

## 🔧 Implementation Rules

### ALWAYS DO ✅
- Use Java Records for all DTOs
- Use `@RequiredArgsConstructor` for dependency injection
- Use `@Transactional(readOnly = true)` on service classes
- Use `@Transactional` on methods that modify data
- Use `FetchType.LAZY` for all relationships
- Use `@Enumerated(EnumType.STRING)` for enums
- Validate all request DTOs with jakarta.validation
- Return proper HTTP status codes (201 POST, 204 DELETE)
- Log business events with `@Slf4j`
- Use pagination for list endpoints

### NEVER DO ❌
- Put business logic in controllers
- Return entities from controllers (use DTOs)
- Use `@Data` on JPA entities
- Use `@Autowired` field injection
- Use `FetchType.EAGER`
- Ignore exceptions silently
- Log passwords or tokens
- Exceed file line limits

---

## 🧪 Test Requirements

### Unit Tests (Services)
- Test all service methods
- Mock repositories
- Test validation logic
- Test business rules (status transitions)

### Integration Tests (Controllers)
- Test all endpoints
- Test authentication
- Test authorization (role checks)
- Test validation errors
- Test error responses

### Test Naming Convention
```java
void methodName_condition_expectedResult()

// Examples:
void login_validCredentials_returnsToken()
void login_invalidPassword_throwsUnauthorized()
void createPackage_validRequest_returnsCreated()
void updateStatus_invalidTransition_throwsBadRequest()
```

---

## 📝 Definition of Done

- [ ] All files created in correct locations
- [ ] No file exceeds line limits
- [ ] All DTOs use Records
- [ ] All services use constructor injection
- [ ] All write operations have `@Transactional`
- [ ] All inputs validated with annotations
- [ ] All exceptions handled in GlobalExceptionHandler
- [ ] Database migrations created and working
- [ ] Application compiles without errors
- [ ] Authentication works (JWT)
- [ ] Role-based access works
- [ ] Status workflow enforced
- [ ] Pagination implemented
- [ ] Search/filter implemented
- [ ] Unit tests pass
- [ ] Integration tests pass

---

## 🚀 Commands

```bash
# Compile
./mvnw clean compile

# Run tests
./mvnw test

# Start with dev profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Package for production
./mvnw clean package -DskipTests

# Run packaged JAR
java -jar target/blue-logistic-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

---

## 🔍 Test Scenarios

### 1. Admin Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bluelogistic.com","password":"admin123"}'
```

### 2. Create Seller (as Admin)
```bash
curl -X POST http://localhost:8080/api/sellers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "name":"John Seller",
    "email":"john@shop.com",
    "password":"seller123",
    "companyName":"John Electronics"
  }'
```

### 3. Seller Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@shop.com","password":"seller123"}'
```

### 4. Create Package (as Seller)
```bash
curl -X POST http://localhost:8080/api/packages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seller-token>" \
  -d '{
    "customerName":"Alice Brown",
    "customerAddress":"123 Main St",
    "customerPostal":"1010",
    "customerCity":"Vienna",
    "customerPhone":"+43123456789",
    "customerEmail":"alice@email.com",
    "weight":2.5
  }'
```

### 5. Update Status to IN_STORAGE (as Admin)
```bash
curl -X PATCH http://localhost:8080/api/packages/<package-id>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{"status":"IN_STORAGE"}'
```

### 6. Add Tracking Number (as Admin)
```bash
curl -X PATCH http://localhost:8080/api/packages/<package-id>/tracking \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{"trackingNumber":"DPD123456789"}'
```

### 7. Get Packages with Filters
```bash
# All packages (Admin)
curl http://localhost:8080/api/packages \
  -H "Authorization: Bearer <admin-token>"

# With status filter
curl "http://localhost:8080/api/packages?status=CREATED&page=0&size=10" \
  -H "Authorization: Bearer <admin-token>"

# With search
curl "http://localhost:8080/api/packages?search=alice" \
  -H "Authorization: Bearer <admin-token>"
```

---

## ⚠️ Important Notes

1. **JWT Secret**: In production, use a secure 256-bit secret via environment variable
2. **CORS**: Configure allowed origins for frontend domain
3. **Password**: Default admin password is `admin123` - change in production
4. **Database**: PostgreSQL required, create database `bluelogistic` before running
5. **Timestamps**: All use `LocalDateTime` with automatic setting via `@PrePersist`/`@PreUpdate`

---

## 📊 Summary

This prompt provides everything needed to implement a complete Package Management Platform with:
- JWT authentication
- Role-based authorization (Admin/Seller)
- Full CRUD for packages and sellers
- Status workflow management
- Search and filtering
- Pagination
- Comprehensive error handling
- Database migrations
- Test coverage requirements

Follow the implementation order, respect the file limits, and check off items in the Definition of Done as you complete them.
