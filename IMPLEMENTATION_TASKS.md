# Implementation Tasks - BlueLogistic

## How to Use This File
Check off tasks as you complete them. Follow the order strictly.
After each phase, compile and fix any errors before moving to the next phase.

---

## Phase 1: Dependencies & Configuration
```
./mvnw clean compile  # Run after this phase
```

- [ ] **1.1** Add JWT dependencies to pom.xml
  - jjwt-api:0.12.6
  - jjwt-impl:0.12.6 (runtime)
  - jjwt-jackson:0.12.6 (runtime)

- [ ] **1.2** Add Flyway dependencies to pom.xml
  - flyway-core
  - flyway-database-postgresql

- [ ] **1.3** Update application.yml (common config)
  - Spring profiles
  - JPA settings
  - JWT config
  - Logging config

- [ ] **1.4** Create application-dev.yml
  - PostgreSQL datasource
  - Show SQL

- [ ] **1.5** Create application-prod.yml
  - Environment variables for datasource
  - Disable SQL logging

---

## Phase 2: Database Migrations
```
# Migrations run automatically on startup
```

- [ ] **2.1** Create db/migration folder
  - Path: src/main/resources/db/migration/

- [ ] **2.2** V1__create_users_table.sql
  - Table: users
  - Columns: id, email, password_hash, name, role, created_at, updated_at
  - Indexes: email, role

- [ ] **2.3** V2__create_sellers_table.sql
  - Table: sellers
  - Columns: id, user_id, company_name, is_active, created_at, updated_at
  - Foreign key: user_id → users(id)
  - Indexes: user_id, is_active

- [ ] **2.4** V3__create_packages_table.sql
  - Table: packages
  - All columns as per requirements
  - Foreign key: seller_id → sellers(id)
  - Indexes: seller_id, status, tracking_number, created_at

- [ ] **2.5** V4__seed_admin_user.sql
  - Insert admin user
  - Email: admin@bluelogistic.com
  - Password: admin123 (BCrypt hashed)

---

## Phase 3: Enums
```
./mvnw clean compile  # Run after this phase
```

- [ ] **3.1** Create entity/enums/Role.java
  - Values: ADMIN, SELLER

- [ ] **3.2** Create entity/enums/PackageStatus.java
  - Values: CREATED, IN_STORAGE, DISPATCHED

---

## Phase 4: Entities
```
./mvnw clean compile  # Run after this phase
```

- [ ] **4.1** Create entity/User.java
  - Implements UserDetails
  - Fields: id, email, passwordHash, name, role, createdAt, updatedAt
  - Lifecycle hooks: @PrePersist, @PreUpdate
  - UserDetails methods implemented

- [ ] **4.2** Create entity/Seller.java
  - Fields: id, user, companyName, isActive, packages, createdAt, updatedAt
  - Relationships: @OneToOne User, @OneToMany Package
  - LAZY fetch types

- [ ] **4.3** Create entity/Package.java
  - Fields: id, seller, customer*, weight, status, trackingNumber, *At
  - Relationships: @ManyToOne Seller
  - LAZY fetch type

---

## Phase 5: Repositories
```
./mvnw clean compile  # Run after this phase
```

- [ ] **5.1** Create repository/UserRepository.java
  - findByEmail()
  - existsByEmail()

- [ ] **5.2** Create repository/SellerRepository.java
  - findByUserId()
  - findAllActiveWithUser() - JOIN FETCH
  - findByIdWithUser() - JOIN FETCH
  - countPackagesBySellerId()

- [ ] **5.3** Create repository/PackageRepository.java
  - Seller queries with pagination
  - Admin queries with pagination
  - Search queries
  - findByIdWithSeller() - JOIN FETCH

---

## Phase 6: DTOs - Requests
```
./mvnw clean compile  # Run after this phase
```

- [ ] **6.1** Create dto/request/LoginRequest.java
  - Record with @NotBlank, @Email

- [ ] **6.2** Create dto/request/CreatePackageRequest.java
  - Record with all validations

- [ ] **6.3** Create dto/request/CreateSellerRequest.java
  - Record with all validations

- [ ] **6.4** Create dto/request/UpdateStatusRequest.java
  - Record with @NotNull PackageStatus

- [ ] **6.5** Create dto/request/UpdateTrackingRequest.java
  - Record with @NotBlank, @Size

- [ ] **6.6** Create dto/request/ChangePasswordRequest.java
  - Record with @NotBlank, @Size

---

## Phase 7: DTOs - Responses
```
./mvnw clean compile  # Run after this phase
```

- [ ] **7.1** Create dto/response/AuthResponse.java
  - Record: token, user

- [ ] **7.2** Create dto/response/UserResponse.java
  - Record: id, email, name, role (NO password!)

- [ ] **7.3** Create dto/response/PackageResponse.java
  - Record with all displayable fields

- [ ] **7.4** Create dto/response/SellerResponse.java
  - Record with user info + packageCount

- [ ] **7.5** Create dto/response/ErrorResponse.java
  - Record with constructors for different cases

---

## Phase 8: Mappers
```
./mvnw clean compile  # Run after this phase
```

- [ ] **8.1** Create mapper/UserMapper.java
  - toResponse(User) → UserResponse

- [ ] **8.2** Create mapper/SellerMapper.java
  - toResponse(Seller, packageCount) → SellerResponse
  - toUserEntity(CreateSellerRequest, encodedPassword) → User
  - toSellerEntity(CreateSellerRequest, User) → Seller

- [ ] **8.3** Create mapper/PackageMapper.java
  - toResponse(Package) → PackageResponse
  - toEntity(CreatePackageRequest, Seller) → Package

---

## Phase 9: Exceptions
```
./mvnw clean compile  # Run after this phase
```

- [ ] **9.1** Create exception/ResourceNotFoundException.java

- [ ] **9.2** Create exception/UnauthorizedException.java

- [ ] **9.3** Create exception/InvalidStatusTransitionException.java

- [ ] **9.4** Create exception/DuplicateResourceException.java

- [ ] **9.5** Create exception/GlobalExceptionHandler.java
  - Handle all custom exceptions
  - Handle MethodArgumentNotValidException
  - Handle BadCredentialsException
  - Handle AccessDeniedException
  - Handle generic Exception

---

## Phase 10: Security Layer
```
./mvnw clean compile  # Run after this phase
```

- [ ] **10.1** Create security/JwtTokenProvider.java
  - generateToken()
  - extractUsername()
  - isTokenValid()

- [ ] **10.2** Create security/JwtAuthenticationFilter.java
  - Extract token from header
  - Validate and set authentication

- [ ] **10.3** Create security/UserDetailsServiceImpl.java
  - loadUserByUsername()

- [ ] **10.4** Create config/ApplicationConfig.java
  - PasswordEncoder bean
  - AuthenticationProvider bean
  - AuthenticationManager bean

- [ ] **10.5** Create config/SecurityConfig.java
  - SecurityFilterChain
  - CORS configuration
  - Route authorization rules

---

## Phase 11: Services
```
./mvnw clean compile  # Run after this phase
```

- [ ] **11.1** Create service/AuthService.java
  - login()
  - getCurrentUser()
  - changePassword()

- [ ] **11.2** Create service/SellerService.java
  - getAllSellers()
  - getSellerById()
  - createSeller()
  - updateSellerStatus()
  - getSellerByUserId()

- [ ] **11.3** Create service/PackageService.java
  - getPackages() - role-aware
  - getPackageById()
  - createPackage()
  - updateStatus() - with workflow validation
  - updateTracking()
  - deletePackage()

---

## Phase 12: Controllers
```
./mvnw clean compile  # Run after this phase
```

- [ ] **12.1** Create controller/AuthController.java
  - POST /api/auth/login
  - GET /api/auth/me
  - PATCH /api/auth/password

- [ ] **12.2** Create controller/SellerController.java
  - GET /api/sellers
  - GET /api/sellers/{id}
  - POST /api/sellers
  - PATCH /api/sellers/{id}

- [ ] **12.3** Create controller/PackageController.java
  - GET /api/packages
  - GET /api/packages/{id}
  - POST /api/packages
  - PATCH /api/packages/{id}/status
  - PATCH /api/packages/{id}/tracking
  - DELETE /api/packages/{id}

---

## Phase 13: Final Verification
```
./mvnw clean compile
./mvnw test
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

- [ ] **13.1** Application starts without errors

- [ ] **13.2** Test login endpoint
  - POST /api/auth/login with admin credentials

- [ ] **13.3** Test create seller (as admin)
  - POST /api/sellers

- [ ] **13.4** Test create package (as seller)
  - Login as new seller
  - POST /api/packages

- [ ] **13.5** Test status workflow (as admin)
  - PATCH /api/packages/{id}/status → IN_STORAGE
  - PATCH /api/packages/{id}/status → DISPATCHED

- [ ] **13.6** Test tracking update (as admin)
  - PATCH /api/packages/{id}/tracking

- [ ] **13.7** Verify role restrictions
  - Seller cannot access /api/sellers
  - Seller cannot update package status
  - Admin can do everything

---

## 🎉 DONE!

All tasks completed. The backend is ready for:
1. Frontend integration
2. Production deployment
3. Further testing

---

## Notes/Issues Log

(Record any issues encountered and their solutions here)

```
Date: ___________
Issue: 
Solution: 

Date: ___________
Issue: 
Solution: 
```
