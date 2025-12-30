# Claude Code Implementation Guide - BlueLogistic Package Management Platform

## 🎯 CRITICAL: Read This First

**Your mission**: Build a complete, production-ready Package Management Platform following these instructions EXACTLY. Do not add features not listed. Do not skip requirements. Follow file limits strictly.

---

## 📋 Implementation Checklist (Follow This Order)

### Phase 1: Project Foundation
- [ ] 1.1 Add JWT dependency to pom.xml
- [ ] 1.2 Create application.yml with all profiles
- [ ] 1.3 Create database migration files (Flyway)

### Phase 2: Entity Layer
- [ ] 2.1 Create enums (Role, PackageStatus)
- [ ] 2.2 Create User entity
- [ ] 2.3 Create Seller entity
- [ ] 2.4 Create Package entity

### Phase 3: Repository Layer
- [ ] 3.1 Create UserRepository
- [ ] 3.2 Create SellerRepository
- [ ] 3.3 Create PackageRepository

### Phase 4: DTO Layer
- [ ] 4.1 Create all Request DTOs
- [ ] 4.2 Create all Response DTOs

### Phase 5: Mapper Layer
- [ ] 5.1 Create UserMapper
- [ ] 5.2 Create SellerMapper
- [ ] 5.3 Create PackageMapper

### Phase 6: Exception Layer
- [ ] 6.1 Create custom exceptions
- [ ] 6.2 Create GlobalExceptionHandler

### Phase 7: Security Layer
- [ ] 7.1 Create JwtTokenProvider
- [ ] 7.2 Create JwtAuthenticationFilter
- [ ] 7.3 Create UserDetailsServiceImpl
- [ ] 7.4 Create SecurityConfig
- [ ] 7.5 Create ApplicationConfig

### Phase 8: Service Layer
- [ ] 8.1 Create AuthService
- [ ] 8.2 Create UserService
- [ ] 8.3 Create SellerService
- [ ] 8.4 Create PackageService

### Phase 9: Controller Layer
- [ ] 9.1 Create AuthController
- [ ] 9.2 Create SellerController
- [ ] 9.3 Create PackageController

### Phase 10: Testing & Documentation
- [ ] 10.1 Create unit tests
- [ ] 10.2 Create integration tests
- [ ] 10.3 Update README

---

## 📁 Exact Project Structure

```
src/main/java/com/bluelogistic/
├── BlueLogisticApplication.java          # EXISTS - DO NOT MODIFY
├── config/
│   ├── SecurityConfig.java               # 80-100 lines max
│   └── ApplicationConfig.java            # 40-60 lines max
├── controller/
│   ├── AuthController.java               # 60-80 lines max
│   ├── SellerController.java             # 60-80 lines max
│   └── PackageController.java            # 80-100 lines max
├── service/
│   ├── AuthService.java                  # 80-120 lines max
│   ├── UserService.java                  # 60-80 lines max
│   ├── SellerService.java                # 100-150 lines max
│   └── PackageService.java               # 150-200 lines max
├── repository/
│   ├── UserRepository.java               # 20-40 lines max
│   ├── SellerRepository.java             # 30-50 lines max
│   └── PackageRepository.java            # 50-80 lines max
├── entity/
│   ├── User.java                         # 60-80 lines max
│   ├── Seller.java                       # 60-80 lines max
│   ├── Package.java                      # 80-100 lines max
│   └── enums/
│       ├── Role.java                     # 10-15 lines max
│       └── PackageStatus.java            # 10-15 lines max
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java             # 10-15 lines max
│   │   ├── CreatePackageRequest.java     # 25-35 lines max
│   │   ├── CreateSellerRequest.java      # 20-25 lines max
│   │   ├── UpdateStatusRequest.java      # 10-15 lines max
│   │   ├── UpdateTrackingRequest.java    # 10-15 lines max
│   │   └── ChangePasswordRequest.java    # 15-20 lines max
│   └── response/
│       ├── AuthResponse.java             # 10-15 lines max
│       ├── UserResponse.java             # 10-15 lines max
│       ├── PackageResponse.java          # 20-30 lines max
│       ├── SellerResponse.java           # 15-25 lines max
│       └── ErrorResponse.java            # 20-30 lines max
├── mapper/
│   ├── UserMapper.java                   # 30-50 lines max
│   ├── SellerMapper.java                 # 40-60 lines max
│   └── PackageMapper.java                # 50-70 lines max
├── security/
│   ├── JwtTokenProvider.java             # 80-100 lines max
│   ├── JwtAuthenticationFilter.java      # 50-70 lines max
│   └── UserDetailsServiceImpl.java       # 30-50 lines max
└── exception/
    ├── GlobalExceptionHandler.java       # 80-120 lines max
    ├── ResourceNotFoundException.java    # 10-15 lines max
    ├── UnauthorizedException.java        # 10-15 lines max
    ├── InvalidStatusTransitionException.java  # 10-15 lines max
    └── DuplicateResourceException.java   # 10-15 lines max

src/main/resources/
├── application.yml                       # Common config
├── application-dev.yml                   # Dev config
├── application-prod.yml                  # Prod config
└── db/migration/
    ├── V1__create_users_table.sql
    ├── V2__create_sellers_table.sql
    └── V3__create_packages_table.sql
```

---

## 🔧 Phase 1: Project Foundation

### 1.1 Update pom.xml - Add these dependencies

```xml
<!-- Add AFTER existing dependencies -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
</dependency>
```

### 1.2 Create application.yml files

**application.yml** (common config):
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

jwt:
  secret: ${JWT_SECRET:your-256-bit-secret-key-here-make-it-long-enough-for-hs256}
  expiration: 86400000  # 24 hours

logging:
  level:
    com.bluelogistic: DEBUG
```

**application-dev.yml**:
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

**application-prod.yml**:
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

### 1.3 Database Migrations

**V1__create_users_table.sql**:
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

**V2__create_sellers_table.sql**:
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

**V3__create_packages_table.sql**:
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
    weight DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CREATED',
    tracking_number VARCHAR(100),
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

---

## 🔧 Phase 2: Entity Layer

### 2.1 Enums

**entity/enums/Role.java**:
```java
package com.bluelogistic.entity.enums;

public enum Role {
    ADMIN,
    SELLER
}
```

**entity/enums/PackageStatus.java**:
```java
package com.bluelogistic.entity.enums;

public enum PackageStatus {
    CREATED,
    IN_STORAGE,
    DISPATCHED
}
```

### 2.2 User Entity

**entity/User.java**:
```java
package com.bluelogistic.entity;

import com.bluelogistic.entity.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }
}
```

### 2.3 Seller Entity

**entity/Seller.java**:
```java
package com.bluelogistic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sellers")
@Getter
@Setter
@NoArgsConstructor
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
    private List<Package> packages = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### 2.4 Package Entity

**entity/Package.java**:
```java
package com.bluelogistic.entity;

import com.bluelogistic.entity.enums.PackageStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "packages")
@Getter
@Setter
@NoArgsConstructor
public class Package {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_address", nullable = false)
    private String customerAddress;

    @Column(name = "customer_postal", nullable = false)
    private String customerPostal;

    @Column(name = "customer_city", nullable = false)
    private String customerCity;

    @Column(name = "customer_phone", nullable = false)
    private String customerPhone;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(nullable = false)
    private Double weight;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PackageStatus status = PackageStatus.CREATED;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "received_at")
    private LocalDateTime receivedAt;

    @Column(name = "dispatched_at")
    private LocalDateTime dispatchedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

---

## 🔧 Phase 3: Repository Layer

### 3.1 UserRepository

**repository/UserRepository.java**:
```java
package com.bluelogistic.repository;

import com.bluelogistic.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
}
```

### 3.2 SellerRepository

**repository/SellerRepository.java**:
```java
package com.bluelogistic.repository;

import com.bluelogistic.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, String> {
    
    Optional<Seller> findByUserId(String userId);
    
    @Query("SELECT s FROM Seller s JOIN FETCH s.user WHERE s.isActive = true")
    List<Seller> findAllActiveWithUser();
    
    @Query("SELECT s FROM Seller s JOIN FETCH s.user WHERE s.id = :id")
    Optional<Seller> findByIdWithUser(@Param("id") String id);
    
    @Query("SELECT COUNT(p) FROM Package p WHERE p.seller.id = :sellerId")
    long countPackagesBySellerId(@Param("sellerId") String sellerId);
}
```

### 3.3 PackageRepository

**repository/PackageRepository.java**:
```java
package com.bluelogistic.repository;

import com.bluelogistic.entity.Package;
import com.bluelogistic.entity.enums.PackageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PackageRepository extends JpaRepository<Package, String> {
    
    // Seller queries
    Page<Package> findBySellerIdOrderByCreatedAtDesc(String sellerId, Pageable pageable);
    
    Page<Package> findBySellerIdAndStatusOrderByCreatedAtDesc(
            String sellerId, PackageStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Package p WHERE p.seller.id = :sellerId " +
           "AND LOWER(p.customerName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Package> findBySellerIdAndCustomerNameContaining(
            @Param("sellerId") String sellerId, 
            @Param("search") String search, 
            Pageable pageable);
    
    // Admin queries
    @Query("SELECT p FROM Package p JOIN FETCH p.seller s JOIN FETCH s.user ORDER BY p.createdAt DESC")
    List<Package> findAllWithSeller();
    
    Page<Package> findByStatusOrderByCreatedAtDesc(PackageStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Package p JOIN FETCH p.seller WHERE p.id = :id")
    Optional<Package> findByIdWithSeller(@Param("id") String id);
    
    @Query("SELECT p FROM Package p WHERE " +
           "LOWER(p.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.trackingNumber) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Package> searchByCustomerNameOrTracking(@Param("search") String search, Pageable pageable);
    
    long countBySellerId(String sellerId);
}
```

---

## 🔧 Phase 4: DTO Layer

### 4.1 Request DTOs

**dto/request/LoginRequest.java**:
```java
package com.bluelogistic.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,
    
    @NotBlank(message = "Password is required")
    String password
) {}
```

**dto/request/CreatePackageRequest.java**:
```java
package com.bluelogistic.dto.request;

import jakarta.validation.constraints.*;

public record CreatePackageRequest(
    @NotBlank(message = "Customer name is required")
    @Size(min = 2, max = 100, message = "Name must be 2-100 characters")
    String customerName,
    
    @NotBlank(message = "Address is required")
    @Size(min = 5, max = 200, message = "Address must be 5-200 characters")
    String customerAddress,
    
    @NotBlank(message = "Postal code is required")
    @Pattern(regexp = "^[0-9]{4,10}$", message = "Invalid postal code")
    String customerPostal,
    
    @NotBlank(message = "City is required")
    @Size(min = 2, max = 100, message = "City must be 2-100 characters")
    String customerCity,
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^\\+?[0-9\\s\\-]{8,20}$", message = "Invalid phone number")
    String customerPhone,
    
    @Email(message = "Invalid email format")
    String customerEmail,
    
    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    @Max(value = 1000, message = "Weight cannot exceed 1000 kg")
    Double weight
) {}
```

**dto/request/CreateSellerRequest.java**:
```java
package com.bluelogistic.dto.request;

import jakarta.validation.constraints.*;

public record CreateSellerRequest(
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be 2-100 characters")
    String name,
    
    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 100, message = "Company name must be 2-100 characters")
    String companyName,
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    String password
) {}
```

**dto/request/UpdateStatusRequest.java**:
```java
package com.bluelogistic.dto.request;

import com.bluelogistic.entity.enums.PackageStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(
    @NotNull(message = "Status is required")
    PackageStatus status
) {}
```

**dto/request/UpdateTrackingRequest.java**:
```java
package com.bluelogistic.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateTrackingRequest(
    @NotBlank(message = "Tracking number is required")
    @Size(max = 100, message = "Tracking number too long")
    String trackingNumber
) {}
```

**dto/request/ChangePasswordRequest.java**:
```java
package com.bluelogistic.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
    @NotBlank(message = "Current password is required")
    String currentPassword,
    
    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "New password must be at least 8 characters")
    String newPassword
) {}
```

### 4.2 Response DTOs

**dto/response/AuthResponse.java**:
```java
package com.bluelogistic.dto.response;

public record AuthResponse(
    String token,
    UserResponse user
) {}
```

**dto/response/UserResponse.java**:
```java
package com.bluelogistic.dto.response;

public record UserResponse(
    String id,
    String email,
    String name,
    String role
) {}
```

**dto/response/PackageResponse.java**:
```java
package com.bluelogistic.dto.response;

import java.time.LocalDateTime;

public record PackageResponse(
    String id,
    String sellerId,
    String sellerCompanyName,
    String customerName,
    String customerAddress,
    String customerPostal,
    String customerCity,
    String customerPhone,
    String customerEmail,
    Double weight,
    String status,
    String trackingNumber,
    LocalDateTime createdAt,
    LocalDateTime receivedAt,
    LocalDateTime dispatchedAt
) {}
```

**dto/response/SellerResponse.java**:
```java
package com.bluelogistic.dto.response;

import java.time.LocalDateTime;

public record SellerResponse(
    String id,
    String userId,
    String name,
    String email,
    String companyName,
    boolean isActive,
    long packageCount,
    LocalDateTime createdAt
) {}
```

**dto/response/ErrorResponse.java**:
```java
package com.bluelogistic.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponse(
    int status,
    String message,
    List<String> errors,
    LocalDateTime timestamp
) {
    public ErrorResponse(int status, String message) {
        this(status, message, null, LocalDateTime.now());
    }
    
    public ErrorResponse(int status, String message, List<String> errors) {
        this(status, message, errors, LocalDateTime.now());
    }
}
```

---

## 🔧 Phase 5: Mapper Layer

### 5.1 UserMapper

**mapper/UserMapper.java**:
```java
package com.bluelogistic.mapper;

import com.bluelogistic.dto.response.UserResponse;
import com.bluelogistic.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    public UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole().name()
        );
    }
}
```

### 5.2 SellerMapper

**mapper/SellerMapper.java**:
```java
package com.bluelogistic.mapper;

import com.bluelogistic.dto.request.CreateSellerRequest;
import com.bluelogistic.dto.response.SellerResponse;
import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.User;
import com.bluelogistic.entity.enums.Role;
import org.springframework.stereotype.Component;

@Component
public class SellerMapper {
    
    public SellerResponse toResponse(Seller seller, long packageCount) {
        User user = seller.getUser();
        return new SellerResponse(
            seller.getId(),
            user.getId(),
            user.getName(),
            user.getEmail(),
            seller.getCompanyName(),
            seller.isActive(),
            packageCount,
            seller.getCreatedAt()
        );
    }
    
    public User toUserEntity(CreateSellerRequest request, String encodedPassword) {
        User user = new User();
        user.setEmail(request.email());
        user.setName(request.name());
        user.setPasswordHash(encodedPassword);
        user.setRole(Role.SELLER);
        return user;
    }
    
    public Seller toSellerEntity(CreateSellerRequest request, User user) {
        Seller seller = new Seller();
        seller.setUser(user);
        seller.setCompanyName(request.companyName());
        seller.setActive(true);
        return seller;
    }
}
```

### 5.3 PackageMapper

**mapper/PackageMapper.java**:
```java
package com.bluelogistic.mapper;

import com.bluelogistic.dto.request.CreatePackageRequest;
import com.bluelogistic.dto.response.PackageResponse;
import com.bluelogistic.entity.Package;
import com.bluelogistic.entity.Seller;
import org.springframework.stereotype.Component;

@Component
public class PackageMapper {
    
    public PackageResponse toResponse(Package pkg) {
        return new PackageResponse(
            pkg.getId(),
            pkg.getSeller().getId(),
            pkg.getSeller().getCompanyName(),
            pkg.getCustomerName(),
            pkg.getCustomerAddress(),
            pkg.getCustomerPostal(),
            pkg.getCustomerCity(),
            pkg.getCustomerPhone(),
            pkg.getCustomerEmail(),
            pkg.getWeight(),
            pkg.getStatus().name(),
            pkg.getTrackingNumber(),
            pkg.getCreatedAt(),
            pkg.getReceivedAt(),
            pkg.getDispatchedAt()
        );
    }
    
    public Package toEntity(CreatePackageRequest request, Seller seller) {
        Package pkg = new Package();
        pkg.setSeller(seller);
        pkg.setCustomerName(request.customerName());
        pkg.setCustomerAddress(request.customerAddress());
        pkg.setCustomerPostal(request.customerPostal());
        pkg.setCustomerCity(request.customerCity());
        pkg.setCustomerPhone(request.customerPhone());
        pkg.setCustomerEmail(request.customerEmail());
        pkg.setWeight(request.weight());
        return pkg;
    }
}
```

---

## 🔧 Phase 6: Exception Layer

### 6.1 Custom Exceptions

**exception/ResourceNotFoundException.java**:
```java
package com.bluelogistic.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, String id) {
        super(String.format("%s with id '%s' not found", resource, id));
    }
}
```

**exception/UnauthorizedException.java**:
```java
package com.bluelogistic.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
```

**exception/InvalidStatusTransitionException.java**:
```java
package com.bluelogistic.exception;

public class InvalidStatusTransitionException extends RuntimeException {
    public InvalidStatusTransitionException(String from, String to) {
        super(String.format("Invalid status transition from %s to %s", from, to));
    }
}
```

**exception/DuplicateResourceException.java**:
```java
package com.bluelogistic.exception;

public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
```

### 6.2 GlobalExceptionHandler

**exception/GlobalExceptionHandler.java**:
```java
package com.bluelogistic.exception;

import com.bluelogistic.dto.response.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(404, ex.getMessage()));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(DuplicateResourceException ex) {
        log.warn("Duplicate resource: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ErrorResponse(409, ex.getMessage()));
    }

    @ExceptionHandler(InvalidStatusTransitionException.class)
    public ResponseEntity<ErrorResponse> handleInvalidTransition(InvalidStatusTransitionException ex) {
        log.warn("Invalid status transition: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse(400, ex.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        log.warn("Unauthorized: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse(401, ex.getMessage()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        log.warn("Bad credentials: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse(401, "Invalid email or password"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(new ErrorResponse(403, "Access denied"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .toList();
        log.warn("Validation failed: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse(400, "Validation failed", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        log.error("Unexpected error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse(500, "An unexpected error occurred"));
    }
}
```

---

## 🔧 Phase 7: Security Layer

### 7.1 JwtTokenProvider

**security/JwtTokenProvider.java**:
```java
package com.bluelogistic.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
            .subject(userDetails.getUsername())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey())
            .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
```

### 7.2 JwtAuthenticationFilter

**security/JwtAuthenticationFilter.java**:
```java
package com.bluelogistic.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String userEmail = jwtTokenProvider.extractUsername(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                
                if (jwtTokenProvider.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            log.warn("JWT validation failed: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
```

### 7.3 UserDetailsServiceImpl

**security/UserDetailsServiceImpl.java**:
```java
package com.bluelogistic.security;

import com.bluelogistic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
```

### 7.4 SecurityConfig

**config/SecurityConfig.java**:
```java
package com.bluelogistic.config;

import com.bluelogistic.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/sellers/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/packages").hasRole("SELLER")
                .requestMatchers(HttpMethod.PATCH, "/api/packages/*/status").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/packages/*/tracking").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/packages/*").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 7.5 ApplicationConfig

**config/ApplicationConfig.java**:
```java
package com.bluelogistic.config;

import com.bluelogistic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

## 🔧 Phase 8: Service Layer

### 8.1 AuthService

**service/AuthService.java**:
```java
package com.bluelogistic.service;

import com.bluelogistic.dto.request.ChangePasswordRequest;
import com.bluelogistic.dto.request.LoginRequest;
import com.bluelogistic.dto.response.AuthResponse;
import com.bluelogistic.dto.response.UserResponse;
import com.bluelogistic.entity.User;
import com.bluelogistic.exception.UnauthorizedException;
import com.bluelogistic.mapper.UserMapper;
import com.bluelogistic.repository.UserRepository;
import com.bluelogistic.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for: {}", request.email());
        
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        
        String token = jwtTokenProvider.generateToken(user);
        log.info("Login successful for: {}", request.email());
        
        return new AuthResponse(token, userMapper.toResponse(user));
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UnauthorizedException("User not found"));
        return userMapper.toResponse(user);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        log.info("Password change attempt for: {}", email);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UnauthorizedException("User not found"));
        
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Current password is incorrect");
        }
        
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        log.info("Password changed successfully for: {}", email);
    }
}
```

### 8.2 SellerService

**service/SellerService.java**:
```java
package com.bluelogistic.service;

import com.bluelogistic.dto.request.CreateSellerRequest;
import com.bluelogistic.dto.response.SellerResponse;
import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.User;
import com.bluelogistic.exception.DuplicateResourceException;
import com.bluelogistic.exception.ResourceNotFoundException;
import com.bluelogistic.mapper.SellerMapper;
import com.bluelogistic.repository.SellerRepository;
import com.bluelogistic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SellerService {

    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;
    private final SellerMapper sellerMapper;
    private final PasswordEncoder passwordEncoder;

    public List<SellerResponse> getAllSellers() {
        log.debug("Fetching all active sellers");
        return sellerRepository.findAllActiveWithUser().stream()
            .map(seller -> sellerMapper.toResponse(
                seller, 
                sellerRepository.countPackagesBySellerId(seller.getId())
            ))
            .toList();
    }

    public SellerResponse getSellerById(String id) {
        Seller seller = sellerRepository.findByIdWithUser(id)
            .orElseThrow(() -> new ResourceNotFoundException("Seller", id));
        return sellerMapper.toResponse(seller, sellerRepository.countPackagesBySellerId(id));
    }

    @Transactional
    public SellerResponse createSeller(CreateSellerRequest request) {
        log.info("Creating seller: {}", request.companyName());
        
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already exists: " + request.email());
        }
        
        String encodedPassword = passwordEncoder.encode(request.password());
        User user = sellerMapper.toUserEntity(request, encodedPassword);
        user = userRepository.save(user);
        
        Seller seller = sellerMapper.toSellerEntity(request, user);
        seller = sellerRepository.save(seller);
        
        log.info("Seller created with id: {}", seller.getId());
        return sellerMapper.toResponse(seller, 0L);
    }

    @Transactional
    public SellerResponse updateSellerStatus(String id, boolean isActive) {
        log.info("Updating seller {} status to: {}", id, isActive);
        
        Seller seller = sellerRepository.findByIdWithUser(id)
            .orElseThrow(() -> new ResourceNotFoundException("Seller", id));
        
        seller.setActive(isActive);
        seller = sellerRepository.save(seller);
        
        return sellerMapper.toResponse(seller, sellerRepository.countPackagesBySellerId(id));
    }

    public Seller getSellerByUserId(String userId) {
        return sellerRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Seller", userId));
    }
}
```

### 8.3 PackageService

**service/PackageService.java**:
```java
package com.bluelogistic.service;

import com.bluelogistic.dto.request.CreatePackageRequest;
import com.bluelogistic.dto.request.UpdateStatusRequest;
import com.bluelogistic.dto.request.UpdateTrackingRequest;
import com.bluelogistic.dto.response.PackageResponse;
import com.bluelogistic.entity.Package;
import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.User;
import com.bluelogistic.entity.enums.PackageStatus;
import com.bluelogistic.entity.enums.Role;
import com.bluelogistic.exception.InvalidStatusTransitionException;
import com.bluelogistic.exception.ResourceNotFoundException;
import com.bluelogistic.mapper.PackageMapper;
import com.bluelogistic.repository.PackageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PackageService {

    private final PackageRepository packageRepository;
    private final PackageMapper packageMapper;
    private final SellerService sellerService;

    public Page<PackageResponse> getPackages(User user, PackageStatus status, String search, Pageable pageable) {
        if (user.getRole() == Role.SELLER) {
            Seller seller = sellerService.getSellerByUserId(user.getId());
            return getSellerPackages(seller.getId(), status, search, pageable);
        }
        return getAdminPackages(status, search, pageable);
    }

    private Page<PackageResponse> getSellerPackages(String sellerId, PackageStatus status, String search, Pageable pageable) {
        Page<Package> packages;
        
        if (search != null && !search.isBlank()) {
            packages = packageRepository.findBySellerIdAndCustomerNameContaining(sellerId, search, pageable);
        } else if (status != null) {
            packages = packageRepository.findBySellerIdAndStatusOrderByCreatedAtDesc(sellerId, status, pageable);
        } else {
            packages = packageRepository.findBySellerIdOrderByCreatedAtDesc(sellerId, pageable);
        }
        
        return packages.map(packageMapper::toResponse);
    }

    private Page<PackageResponse> getAdminPackages(PackageStatus status, String search, Pageable pageable) {
        Page<Package> packages;
        
        if (search != null && !search.isBlank()) {
            packages = packageRepository.searchByCustomerNameOrTracking(search, pageable);
        } else if (status != null) {
            packages = packageRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        } else {
            packages = packageRepository.findAll(pageable);
        }
        
        return packages.map(packageMapper::toResponse);
    }

    public PackageResponse getPackageById(String id) {
        Package pkg = packageRepository.findByIdWithSeller(id)
            .orElseThrow(() -> new ResourceNotFoundException("Package", id));
        return packageMapper.toResponse(pkg);
    }

    @Transactional
    public PackageResponse createPackage(CreatePackageRequest request, User user) {
        log.info("Creating package for customer: {}", request.customerName());
        
        Seller seller = sellerService.getSellerByUserId(user.getId());
        Package pkg = packageMapper.toEntity(request, seller);
        pkg = packageRepository.save(pkg);
        
        log.info("Package created with id: {}", pkg.getId());
        return packageMapper.toResponse(pkg);
    }

    @Transactional
    public PackageResponse updateStatus(String id, UpdateStatusRequest request) {
        log.info("Updating package {} status to: {}", id, request.status());
        
        Package pkg = packageRepository.findByIdWithSeller(id)
            .orElseThrow(() -> new ResourceNotFoundException("Package", id));
        
        validateStatusTransition(pkg.getStatus(), request.status());
        
        pkg.setStatus(request.status());
        
        if (request.status() == PackageStatus.IN_STORAGE) {
            pkg.setReceivedAt(LocalDateTime.now());
        } else if (request.status() == PackageStatus.DISPATCHED) {
            pkg.setDispatchedAt(LocalDateTime.now());
        }
        
        pkg = packageRepository.save(pkg);
        return packageMapper.toResponse(pkg);
    }

    @Transactional
    public PackageResponse updateTracking(String id, UpdateTrackingRequest request) {
        log.info("Adding tracking number to package {}: {}", id, request.trackingNumber());
        
        Package pkg = packageRepository.findByIdWithSeller(id)
            .orElseThrow(() -> new ResourceNotFoundException("Package", id));
        
        pkg.setTrackingNumber(request.trackingNumber());
        pkg = packageRepository.save(pkg);
        
        return packageMapper.toResponse(pkg);
    }

    @Transactional
    public void deletePackage(String id) {
        log.info("Deleting package: {}", id);
        
        if (!packageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Package", id);
        }
        
        packageRepository.deleteById(id);
    }

    private void validateStatusTransition(PackageStatus current, PackageStatus next) {
        boolean valid = switch (current) {
            case CREATED -> next == PackageStatus.IN_STORAGE;
            case IN_STORAGE -> next == PackageStatus.DISPATCHED;
            case DISPATCHED -> false;
        };
        
        if (!valid) {
            throw new InvalidStatusTransitionException(current.name(), next.name());
        }
    }
}
```

---

## 🔧 Phase 9: Controller Layer

### 9.1 AuthController

**controller/AuthController.java**:
```java
package com.bluelogistic.controller;

import com.bluelogistic.dto.request.ChangePasswordRequest;
import com.bluelogistic.dto.request.LoginRequest;
import com.bluelogistic.dto.response.AuthResponse;
import com.bluelogistic.dto.response.UserResponse;
import com.bluelogistic.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(authService.getCurrentUser(userDetails.getUsername()));
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.noContent().build();
    }
}
```

### 9.2 SellerController

**controller/SellerController.java**:
```java
package com.bluelogistic.controller;

import com.bluelogistic.dto.request.CreateSellerRequest;
import com.bluelogistic.dto.response.PackageResponse;
import com.bluelogistic.dto.response.SellerResponse;
import com.bluelogistic.entity.enums.PackageStatus;
import com.bluelogistic.service.PackageService;
import com.bluelogistic.service.SellerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sellers")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;
    private final PackageService packageService;

    @GetMapping
    public ResponseEntity<List<SellerResponse>> getAllSellers() {
        return ResponseEntity.ok(sellerService.getAllSellers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SellerResponse> getSellerById(@PathVariable String id) {
        return ResponseEntity.ok(sellerService.getSellerById(id));
    }

    @PostMapping
    public ResponseEntity<SellerResponse> createSeller(@Valid @RequestBody CreateSellerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sellerService.createSeller(request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SellerResponse> updateSellerStatus(
            @PathVariable String id,
            @RequestParam boolean isActive) {
        return ResponseEntity.ok(sellerService.updateSellerStatus(id, isActive));
    }
}
```

### 9.3 PackageController

**controller/PackageController.java**:
```java
package com.bluelogistic.controller;

import com.bluelogistic.dto.request.CreatePackageRequest;
import com.bluelogistic.dto.request.UpdateStatusRequest;
import com.bluelogistic.dto.request.UpdateTrackingRequest;
import com.bluelogistic.dto.response.PackageResponse;
import com.bluelogistic.entity.User;
import com.bluelogistic.entity.enums.PackageStatus;
import com.bluelogistic.service.PackageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class PackageController {

    private final PackageService packageService;

    @GetMapping
    public ResponseEntity<Page<PackageResponse>> getPackages(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) PackageStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(packageService.getPackages(user, status, search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PackageResponse> getPackageById(@PathVariable String id) {
        return ResponseEntity.ok(packageService.getPackageById(id));
    }

    @PostMapping
    public ResponseEntity<PackageResponse> createPackage(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreatePackageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(packageService.createPackage(request, user));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PackageResponse> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(packageService.updateStatus(id, request));
    }

    @PatchMapping("/{id}/tracking")
    public ResponseEntity<PackageResponse> updateTracking(
            @PathVariable String id,
            @Valid @RequestBody UpdateTrackingRequest request) {
        return ResponseEntity.ok(packageService.updateTracking(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable String id) {
        packageService.deletePackage(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 🔧 Phase 10: Database Seed Data

Create a migration for initial admin user:

**V4__seed_admin_user.sql**:
```sql
-- Password is 'admin123' encoded with BCrypt
INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'admin@bluelogistic.com',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi',
    'Admin User',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
```

---

## ⚠️ CRITICAL RULES - READ CAREFULLY

### DO NOT:
1. ❌ Add features not in requirements (no email sending, no file upload, no external integrations)
2. ❌ Skip validation annotations
3. ❌ Put business logic in controllers
4. ❌ Return entities directly from controllers
5. ❌ Use `@Data` on entities
6. ❌ Use field injection (`@Autowired` on fields)
7. ❌ Ignore exceptions
8. ❌ Log sensitive data (passwords, tokens)
9. ❌ Use EAGER fetch type
10. ❌ Exceed file line limits

### MUST DO:
1. ✅ Use Records for all DTOs
2. ✅ Use constructor injection (`@RequiredArgsConstructor`)
3. ✅ Use `@Transactional(readOnly = true)` on service classes
4. ✅ Use `@Transactional` on write methods
5. ✅ Validate all input with annotations
6. ✅ Use proper HTTP status codes
7. ✅ Log important business events
8. ✅ Handle all exceptions in GlobalExceptionHandler
9. ✅ Use LAZY fetch by default
10. ✅ Follow the exact package structure

---

## 🧪 Testing Commands

After implementation, verify with:

```bash
# Compile
./mvnw clean compile

# Run tests
./mvnw test

# Start application (requires PostgreSQL)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

---

## 📊 API Test Scenarios

### 1. Login as Admin
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bluelogistic.com","password":"admin123"}'
```

### 2. Create Seller (Admin)
```bash
curl -X POST http://localhost:8080/api/sellers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name":"John Seller",
    "companyName":"John's Shop",
    "email":"john@shop.com",
    "password":"seller123"
  }'
```

### 3. Create Package (Seller)
```bash
curl -X POST http://localhost:8080/api/packages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "customerName":"Jane Doe",
    "customerAddress":"123 Main St",
    "customerPostal":"1010",
    "customerCity":"Vienna",
    "customerPhone":"+431234567",
    "weight":2.5
  }'
```

---

## ✅ Final Checklist

Before marking as complete:

- [ ] All files created in correct locations
- [ ] No file exceeds line limits
- [ ] All DTOs use Record
- [ ] All services use constructor injection
- [ ] All write operations have @Transactional
- [ ] All inputs validated
- [ ] All exceptions handled
- [ ] Database migrations created
- [ ] Application compiles without errors
- [ ] Authentication works
- [ ] Role-based access works
- [ ] Status workflow works (CREATED → IN_STORAGE → DISPATCHED)
