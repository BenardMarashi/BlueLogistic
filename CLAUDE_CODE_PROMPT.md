# CLAUDE CODE IMPLEMENTATION INSTRUCTIONS

## 🎯 YOUR MISSION

You are implementing a **Package Management Platform** called BlueLogistic. Read this entire file carefully before starting. Complete all tasks in order.

---

## 📁 PROJECT LOCATION

The project already exists at: `blue-logistic/`

**DO NOT** create a new project. Work within the existing structure.

---

## 📋 CURRENT STATUS

The project is ~85% complete. The following are **ALREADY DONE**:
- ✅ pom.xml with all dependencies
- ✅ All database migrations (V1-V4)
- ✅ All entities (User, Seller, Package, enums)
- ✅ All repositories (with most queries)
- ✅ All services (AuthService, JwtService, SellerService, PackageService)
- ✅ All controllers (AuthController, SellerController, PackageController)
- ✅ Security configuration (JWT auth, filters)
- ✅ Basic exception handling

---

## ❌ TASKS TO COMPLETE

Complete these tasks IN ORDER:

### TASK 1: Create Missing Exception Classes

Create `blue-logistic/src/main/java/com/bluelogistic/exception/DuplicateResourceException.java`:
```java
package com.bluelogistic.exception;

public class DuplicateResourceException extends RuntimeException {
    
    public DuplicateResourceException(String message) {
        super(message);
    }
}
```

Create `blue-logistic/src/main/java/com/bluelogistic/exception/InvalidStatusTransitionException.java`:
```java
package com.bluelogistic.exception;

public class InvalidStatusTransitionException extends RuntimeException {
    
    public InvalidStatusTransitionException(String from, String to) {
        super(String.format("Invalid status transition from %s to %s", from, to));
    }
}
```

---

### TASK 2: Create ErrorResponse DTO

Create `blue-logistic/src/main/java/com/bluelogistic/dto/ErrorResponse.java`:
```java
package com.bluelogistic.dto;

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

### TASK 3: Create UpdateSellerRequest DTO

Create `blue-logistic/src/main/java/com/bluelogistic/dto/UpdateSellerRequest.java`:
```java
package com.bluelogistic.dto;

import jakarta.validation.constraints.Size;

public record UpdateSellerRequest(
    @Size(min = 2, max = 100, message = "Company name must be 2-100 characters")
    String companyName,
    
    Boolean isActive
) {}
```

---

### TASK 4: Create CORS Configuration

Create `blue-logistic/src/main/java/com/bluelogistic/config/CorsConfig.java`:
```java
package com.bluelogistic.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

---

### TASK 5: Update SecurityConfig to Enable CORS

Modify `blue-logistic/src/main/java/com/bluelogistic/config/SecurityConfig.java`:

Find the `securityFilterChain` method and add `.cors(Customizer.withDefaults())` after `.csrf(csrf -> csrf.disable())`:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(Customizer.withDefaults())  // ADD THIS LINE
        .authorizeHttpRequests(authz -> authz
            .requestMatchers("/api/auth/login").permitAll()
            .anyRequest().authenticated()
        )
        // ... rest of config
```

Add the import at the top:
```java
import org.springframework.security.config.Customizer;
```

---

### TASK 6: Add Missing Repository Methods

Add these methods to `blue-logistic/src/main/java/com/bluelogistic/repository/PackageRepository.java`:

```java
// Add these methods to the interface:

Page<Package> findBySellerIdAndStatus(String sellerId, PackageStatus status, Pageable pageable);

@Query("SELECT p FROM Package p WHERE p.seller.id = :sellerId " +
       "AND LOWER(p.customerName) LIKE LOWER(CONCAT('%', :search, '%'))")
Page<Package> findBySellerIdAndCustomerNameContaining(
    @Param("sellerId") String sellerId, 
    @Param("search") String search, 
    Pageable pageable);

@Query("SELECT p FROM Package p WHERE " +
       "LOWER(p.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
       "LOWER(p.trackingNumber) LIKE LOWER(CONCAT('%', :search, '%'))")
Page<Package> searchByCustomerNameOrTracking(@Param("search") String search, Pageable pageable);

@Query("SELECT p FROM Package p JOIN FETCH p.seller WHERE p.seller.id = :sellerId")
Page<Package> findBySellerIdWithSeller(@Param("sellerId") String sellerId, Pageable pageable);
```

---

### TASK 7: Update PackageService with Filtering Methods

Add these methods to `blue-logistic/src/main/java/com/bluelogistic/service/PackageService.java`:

```java
public Page<Package> getPackagesFiltered(PackageStatus status, String sellerId, String search, Pageable pageable) {
    if (search != null && !search.isBlank()) {
        return packageRepository.searchByCustomerNameOrTracking(search.trim(), pageable);
    }
    if (sellerId != null && status != null) {
        return packageRepository.findBySellerIdAndStatus(sellerId, status, pageable);
    }
    if (sellerId != null) {
        return packageRepository.findBySellerId(sellerId, pageable);
    }
    if (status != null) {
        return packageRepository.findByStatus(status, pageable);
    }
    return packageRepository.findAll(pageable);
}

public Page<Package> getPackagesBySellerFiltered(String sellerId, PackageStatus status, String search, Pageable pageable) {
    if (search != null && !search.isBlank()) {
        return packageRepository.findBySellerIdAndCustomerNameContaining(sellerId, search.trim(), pageable);
    }
    if (status != null) {
        return packageRepository.findBySellerIdAndStatus(sellerId, status, pageable);
    }
    return packageRepository.findBySellerId(sellerId, pageable);
}
```

---

### TASK 8: Update PackageController with Filter Parameters

Replace the `getPackages` method in `blue-logistic/src/main/java/com/bluelogistic/controller/PackageController.java`:

```java
@GetMapping
public ResponseEntity<Page<PackageResponse>> getPackages(
        @AuthenticationPrincipal User user,
        @RequestParam(required = false) PackageStatus status,
        @RequestParam(required = false) String sellerId,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir) {
    
    Sort sort = sortDir.equalsIgnoreCase("asc") 
        ? Sort.by(sortBy).ascending() 
        : Sort.by(sortBy).descending();
    Pageable pageable = PageRequest.of(page, size, sort);
    
    Page<Package> packages;
    
    if (user.getRole() == Role.SELLER) {
        Seller seller = sellerService.getSellerByUserId(user.getId());
        packages = packageService.getPackagesBySellerFiltered(seller.getId(), status, search, pageable);
    } else {
        packages = packageService.getPackagesFiltered(status, sellerId, search, pageable);
    }
    
    return ResponseEntity.ok(packages.map(packageMapper::toResponse));
}
```

Add these imports at the top:
```java
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import com.bluelogistic.entity.enums.PackageStatus;
```

---

### TASK 9: Add Seller Packages Endpoint

Add this method to `blue-logistic/src/main/java/com/bluelogistic/controller/SellerController.java`:

```java
@GetMapping("/{id}/packages")
public ResponseEntity<Page<PackageResponse>> getSellerPackages(
        @PathVariable String id,
        @RequestParam(required = false) PackageStatus status,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {
    
    // Verify seller exists
    sellerService.getSellerById(id);
    
    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    Page<Package> packages = packageService.getPackagesBySellerFiltered(id, status, search, pageable);
    
    return ResponseEntity.ok(packages.map(packageMapper::toResponse));
}
```

Add these imports:
```java
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import com.bluelogistic.dto.PackageResponse;
import com.bluelogistic.entity.Package;
import com.bluelogistic.entity.enums.PackageStatus;
import com.bluelogistic.service.PackageService;
import com.bluelogistic.mapper.PackageMapper;
```

Add the dependencies to the class:
```java
private final PackageService packageService;
private final PackageMapper packageMapper;
```

---

### TASK 10: Update GlobalExceptionHandler

Add these exception handlers to `blue-logistic/src/main/java/com/bluelogistic/controller/GlobalExceptionHandler.java`:

```java
@ExceptionHandler(DuplicateResourceException.class)
public ResponseEntity<Map<String, String>> handleDuplicateResource(DuplicateResourceException ex) {
    log.warn("Duplicate resource: {}", ex.getMessage());
    Map<String, String> error = new HashMap<>();
    error.put("error", ex.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
}

@ExceptionHandler(InvalidStatusTransitionException.class)
public ResponseEntity<Map<String, String>> handleInvalidStatusTransition(InvalidStatusTransitionException ex) {
    log.warn("Invalid status transition: {}", ex.getMessage());
    Map<String, String> error = new HashMap<>();
    error.put("error", ex.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
}
```

Add these imports:
```java
import com.bluelogistic.exception.DuplicateResourceException;
import com.bluelogistic.exception.InvalidStatusTransitionException;
```

---

### TASK 11: Update PackageService to Use InvalidStatusTransitionException

In `blue-logistic/src/main/java/com/bluelogistic/service/PackageService.java`, update the `validateStatusTransition` method:

```java
private void validateStatusTransition(PackageStatus currentStatus, PackageStatus newStatus) {
    boolean isValid = switch (currentStatus) {
        case CREATED -> newStatus == PackageStatus.IN_STORAGE;
        case IN_STORAGE -> newStatus == PackageStatus.DISPATCHED;
        case DISPATCHED -> false;
    };
    
    if (!isValid) {
        throw new InvalidStatusTransitionException(currentStatus.name(), newStatus.name());
    }
}
```

Add the import:
```java
import com.bluelogistic.exception.InvalidStatusTransitionException;
```

---

### TASK 12: Update SellerService to Use DuplicateResourceException

In `blue-logistic/src/main/java/com/bluelogistic/service/SellerService.java`, update the `createSeller` method:

Change this line:
```java
throw new BusinessException("Email already exists");
```

To:
```java
throw new DuplicateResourceException("Email already exists: " + email);
```

Add the import:
```java
import com.bluelogistic.exception.DuplicateResourceException;
```

---

### TASK 13: Verify and Compile

Run these commands to verify everything works:

```bash
cd blue-logistic
./mvnw clean compile
```

If there are any errors, fix them before proceeding.

---

### TASK 14: Update README.md

Replace the content of `README.md` with:

```markdown
# BlueLogistic - Package Management Platform

## Overview
A package management platform for a logistics company that works with multiple sellers.

## Features
- **Sellers** can create packages with customer details
- **Admins** can manage package status and tracking numbers
- JWT-based authentication
- Role-based access control

## Tech Stack
- Java 21
- Spring Boot 3.5.9
- PostgreSQL
- Spring Security + JWT
- Flyway migrations

## Prerequisites
- Java 21+
- PostgreSQL 15+
- Maven 3.9+

## Setup

### 1. Create Database
```bash
createdb bluelogistic
```

### 2. Configure Database (optional)
Edit `src/main/resources/application-dev.yml` if needed:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/bluelogistic
    username: bluelogistic
    password: bluelogistic123
```

### 3. Run Application
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

## Default Admin Credentials
- Email: `admin@bluelogistic.com`
- Password: `admin123`

## API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Authenticated | Get current user |
| PATCH | `/api/auth/password` | Authenticated | Change password |

### Packages
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/packages` | Authenticated | List packages (role-filtered) |
| POST | `/api/packages` | Seller | Create package |
| GET | `/api/packages/{id}` | Authenticated | Get package details |
| PATCH | `/api/packages/{id}/status` | Admin | Update status |
| PATCH | `/api/packages/{id}/tracking` | Admin | Add tracking number |
| DELETE | `/api/packages/{id}` | Admin | Delete package |

### Sellers (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sellers` | List all sellers |
| POST | `/api/sellers` | Create seller |
| GET | `/api/sellers/{id}` | Get seller details |
| PATCH | `/api/sellers/{id}/status` | Update seller status |
| GET | `/api/sellers/{id}/packages` | Get seller's packages |

## Package Status Workflow
```
CREATED → IN_STORAGE → DISPATCHED
```

## Testing
```bash
./mvnw test
```

## Build for Production
```bash
./mvnw clean package -DskipTests
java -jar target/blue-logistic-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```
```

---

## ✅ VERIFICATION CHECKLIST

After completing all tasks, verify:

1. [ ] Project compiles: `./mvnw clean compile`
2. [ ] Application starts: `./mvnw spring-boot:run -Dspring-boot.run.profiles=dev`
3. [ ] Login works:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bluelogistic.com","password":"admin123"}'
```
4. [ ] Get packages with filters works:
```bash
curl "http://localhost:8080/api/packages?status=CREATED&page=0&size=10" \
  -H "Authorization: Bearer <token>"
```

---

## 🚫 DO NOT

- Do not modify pom.xml (dependencies are already correct)
- Do not modify database migrations (they are correct)
- Do not change the entity structure
- Do not add features not listed in this document
- Do not exceed file line limits (100 for controllers, 200 for services)

---

## 📝 NOTES

- All DTOs should use Java Records
- Use `@RequiredArgsConstructor` for dependency injection
- Use `@Transactional(readOnly = true)` on service classes
- Use `@Transactional` on write methods
- Use LAZY fetch for all JPA relationships
- Log important business events with `@Slf4j`

---

## START IMPLEMENTATION NOW

Begin with TASK 1 and proceed in order. After each task, verify the code compiles before moving to the next task.
