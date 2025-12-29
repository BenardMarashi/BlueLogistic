# Best Practices Guide - Package Management Platform

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Java & Spring Boot](#2-java--spring-boot)
3. [REST API Design](#3-rest-api-design)
4. [Database & JPA](#4-database--jpa)
5. [Security](#5-security)
6. [Error Handling](#6-error-handling)
7. [Logging](#7-logging)
8. [Testing](#8-testing)
9. [Frontend (React/Next.js)](#9-frontend-reactnextjs)
10. [Git Workflow](#10-git-workflow)
11. [Performance](#11-performance)
12. [Common Mistakes to Avoid](#12-common-mistakes-to-avoid)

---

## 1. Project Setup

### 1.1 Use Spring Initializr

Start with [start.spring.io](https://start.spring.io):

```
Project: Maven
Language: Java
Spring Boot: 3.2+
Java: 21
Dependencies:
  - Spring Web
  - Spring Data JPA
  - Spring Security
  - PostgreSQL Driver
  - Lombok
  - Validation
```

### 1.2 Project Structure

```
src/main/java/com/logistics/packagemanagement/
├── config/           # Configuration classes
├── controller/       # REST controllers (thin, no business logic)
├── service/          # Business logic (interfaces + impl)
├── repository/       # Data access
├── entity/           # JPA entities
├── dto/              # Data Transfer Objects
│   ├── request/      # Incoming data
│   └── response/     # Outgoing data
├── mapper/           # Entity ↔ DTO conversion
├── security/         # Security components
├── exception/        # Custom exceptions + handler
└── util/             # Helper classes
```

### 1.3 Package Naming

```
✅ Good: com.logistics.packagemanagement.controller
❌ Bad:  com.logistics.packagemanagement.controllers (avoid plural)

✅ Good: com.logistics.packagemanagement.service
❌ Bad:  com.logistics.packagemanagement.services
```

### 1.4 Configuration Files

```
src/main/resources/
├── application.yml           # Common config
├── application-dev.yml       # Development config
├── application-prod.yml      # Production config
└── application-test.yml      # Test config
```

**Use profiles:**
```yaml
# application.yml
spring:
  profiles:
    active: dev
```

---

## 2. Java & Spring Boot

### 2.1 Use Records for DTOs (Java 21)

```java
// ✅ Good - Immutable, less boilerplate
public record CreatePackageRequest(
    @NotBlank String customerName,
    @NotBlank String customerAddress,
    @NotBlank String customerPostal,
    @NotBlank String customerCity,
    @NotBlank String customerPhone,
    @Email String customerEmail,
    @Positive Double weight
) {}

// ❌ Bad - Too much boilerplate
public class CreatePackageRequest {
    private String customerName;
    // ... getters, setters, constructor, equals, hashCode
}
```

### 2.2 Use Constructor Injection

```java
// ✅ Good - Constructor injection (testable, immutable)
@Service
@RequiredArgsConstructor
public class PackageService {
    private final PackageRepository packageRepository;
    private final SellerRepository sellerRepository;
}

// ❌ Bad - Field injection (hard to test)
@Service
public class PackageService {
    @Autowired
    private PackageRepository packageRepository;
}
```

### 2.3 Keep Controllers Thin

```java
// ✅ Good - Controller only handles HTTP, delegates to service
@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class PackageController {
    
    private final PackageService packageService;
    
    @PostMapping
    public ResponseEntity<PackageResponse> create(
            @Valid @RequestBody CreatePackageRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(packageService.createPackage(request, user));
    }
}

// ❌ Bad - Business logic in controller
@PostMapping
public ResponseEntity<PackageResponse> create(@RequestBody CreatePackageRequest request) {
    // Validation here...
    // Database calls here...
    // Business logic here...
    // This is wrong!
}
```

### 2.4 Service Layer Pattern

```java
// Interface (optional but good for testing)
public interface PackageService {
    PackageResponse createPackage(CreatePackageRequest request, UserDetails user);
    List<PackageResponse> getPackages(UserDetails user);
    PackageResponse updateStatus(String id, PackageStatus status);
}

// Implementation
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PackageServiceImpl implements PackageService {
    
    private final PackageRepository packageRepository;
    private final PackageMapper packageMapper;
    
    @Override
    @Transactional
    public PackageResponse createPackage(CreatePackageRequest request, UserDetails user) {
        // Business logic here
    }
}
```

### 2.5 Use Optional Correctly

```java
// ✅ Good
public PackageResponse getPackage(String id) {
    return packageRepository.findById(id)
        .map(packageMapper::toResponse)
        .orElseThrow(() -> new ResourceNotFoundException("Package", id));
}

// ❌ Bad - Don't use get() without checking
public PackageResponse getPackage(String id) {
    return packageMapper.toResponse(packageRepository.findById(id).get());
}

// ❌ Bad - Don't use Optional as parameter
public void process(Optional<String> name) { }
```

### 2.6 Use Lombok Wisely

```java
// ✅ Good annotations
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

// ⚠️ Be careful with @Data on entities (includes @EqualsAndHashCode)
// ❌ Avoid on JPA entities
@Data  // Can cause issues with lazy loading

// ✅ Better for entities
@Getter
@Setter
@NoArgsConstructor
```

---

## 3. REST API Design

### 3.1 Use Proper HTTP Methods

| Method | Usage | Example |
|--------|-------|---------|
| GET | Retrieve data | GET /api/packages |
| POST | Create new resource | POST /api/packages |
| PUT | Replace entire resource | PUT /api/packages/{id} |
| PATCH | Partial update | PATCH /api/packages/{id}/status |
| DELETE | Remove resource | DELETE /api/packages/{id} |

### 3.2 Use Proper HTTP Status Codes

```java
// ✅ Good - Correct status codes
@PostMapping
public ResponseEntity<PackageResponse> create(@Valid @RequestBody CreatePackageRequest request) {
    PackageResponse response = packageService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);  // 201
}

@GetMapping("/{id}")
public ResponseEntity<PackageResponse> getById(@PathVariable String id) {
    return ResponseEntity.ok(packageService.getById(id));  // 200
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable String id) {
    packageService.delete(id);
    return ResponseEntity.noContent().build();  // 204
}
```

**Status Code Reference:**

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Not authorized (wrong role) |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry |
| 500 | Server Error | Unexpected error |

### 3.3 Consistent Response Format

```java
// ✅ Good - Consistent response structure
public record ApiResponse<T>(
    boolean success,
    T data,
    String message
) {
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null);
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message);
    }
}

// Usage
@GetMapping
public ResponseEntity<ApiResponse<List<PackageResponse>>> getAll() {
    return ResponseEntity.ok(ApiResponse.success(packageService.getAll()));
}
```

### 3.4 Use Plural Nouns for Endpoints

```
✅ Good:
GET    /api/packages
GET    /api/packages/{id}
POST   /api/packages
GET    /api/sellers
GET    /api/sellers/{id}/packages

❌ Bad:
GET    /api/package
POST   /api/createPackage
GET    /api/getPackageById/{id}
```

### 3.5 Pagination for Lists

```java
@GetMapping
public ResponseEntity<Page<PackageResponse>> getAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir) {
    
    Sort sort = sortDir.equalsIgnoreCase("asc") 
        ? Sort.by(sortBy).ascending() 
        : Sort.by(sortBy).descending();
    
    Pageable pageable = PageRequest.of(page, size, sort);
    return ResponseEntity.ok(packageService.getAll(pageable));
}
```

### 3.6 API Versioning

```java
// Option 1: URL versioning (recommended for simplicity)
@RestController
@RequestMapping("/api/v1/packages")
public class PackageController { }

// Option 2: Header versioning
@GetMapping(headers = "X-API-VERSION=1")
public ResponseEntity<?> getV1() { }
```

---

## 4. Database & JPA

### 4.1 Entity Best Practices

```java
@Entity
@Table(name = "packages")
@Getter
@Setter
@NoArgsConstructor
public class Package {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String customerName;
    
    @Column(nullable = false)
    private String customerAddress;
    
    @Enumerated(EnumType.STRING)  // ✅ Store as string, not ordinal
    @Column(nullable = false)
    private PackageStatus status = PackageStatus.CREATED;
    
    @ManyToOne(fetch = FetchType.LAZY)  // ✅ LAZY by default
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
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

### 4.2 Use LAZY Loading

```java
// ✅ Good - LAZY loading (loads only when accessed)
@ManyToOne(fetch = FetchType.LAZY)
private Seller seller;

@OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
private List<Package> packages;

// ❌ Bad - EAGER loading (always loads, even when not needed)
@ManyToOne(fetch = FetchType.EAGER)
private Seller seller;
```

### 4.3 Avoid N+1 Problem

```java
// ❌ Bad - N+1 queries
List<Package> packages = packageRepository.findAll();
for (Package p : packages) {
    System.out.println(p.getSeller().getCompanyName());  // Extra query for each!
}

// ✅ Good - JOIN FETCH
@Query("SELECT p FROM Package p JOIN FETCH p.seller")
List<Package> findAllWithSeller();

// ✅ Good - EntityGraph
@EntityGraph(attributePaths = {"seller"})
List<Package> findAll();
```

### 4.4 Use Indexes

```java
@Entity
@Table(name = "packages", indexes = {
    @Index(name = "idx_package_seller", columnList = "seller_id"),
    @Index(name = "idx_package_status", columnList = "status"),
    @Index(name = "idx_package_created", columnList = "created_at")
})
public class Package { }
```

### 4.5 Repository Best Practices

```java
public interface PackageRepository extends JpaRepository<Package, String> {
    
    // ✅ Good - Method name query
    List<Package> findBySellerIdOrderByCreatedAtDesc(String sellerId);
    
    // ✅ Good - With pagination
    Page<Package> findByStatus(PackageStatus status, Pageable pageable);
    
    // ✅ Good - Custom JPQL with JOIN FETCH
    @Query("SELECT p FROM Package p JOIN FETCH p.seller WHERE p.status = :status")
    List<Package> findByStatusWithSeller(@Param("status") PackageStatus status);
    
    // ✅ Good - Count query
    long countBySellerId(String sellerId);
    
    // ✅ Good - Exists query
    boolean existsByTrackingNumber(String trackingNumber);
}
```

### 4.6 Use @Transactional Properly

```java
@Service
@Transactional(readOnly = true)  // Default: read-only for all methods
public class PackageServiceImpl implements PackageService {
    
    @Override
    public List<PackageResponse> getAll() {
        // Uses read-only transaction (better performance)
        return packageRepository.findAll().stream()
            .map(packageMapper::toResponse)
            .toList();
    }
    
    @Override
    @Transactional  // Override: read-write for this method
    public PackageResponse create(CreatePackageRequest request) {
        // Uses read-write transaction
        Package entity = packageMapper.toEntity(request);
        return packageMapper.toResponse(packageRepository.save(entity));
    }
}
```

### 4.7 Database Migrations with Flyway

```
src/main/resources/db/migration/
├── V1__create_users_table.sql
├── V2__create_sellers_table.sql
├── V3__create_packages_table.sql
└── V4__add_tracking_number_column.sql
```

```sql
-- V1__create_users_table.sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

---

## 5. Security

### 5.1 JWT Configuration

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/seller/**").hasRole("SELLER")
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### 5.2 Password Encoding

```java
// ✅ Always use BCrypt
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// Usage
String hashedPassword = passwordEncoder.encode(rawPassword);
boolean matches = passwordEncoder.matches(rawPassword, hashedPassword);
```

### 5.3 Protect Sensitive Data

```java
// ✅ Never return password in response
public record UserResponse(
    String id,
    String email,
    String name,
    String role
    // NO password field!
) {}

// ✅ Use @JsonIgnore if needed
@Entity
public class User {
    @JsonIgnore
    private String passwordHash;
}
```

### 5.4 Method-Level Security

```java
@RestController
@RequestMapping("/api/packages")
public class PackageController {
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    public ResponseEntity<?> getAll() { }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus() { }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete() { }
}
```

### 5.5 Input Validation

```java
// ✅ Always validate input
public record CreatePackageRequest(
    @NotBlank(message = "Customer name is required")
    @Size(min = 2, max = 100, message = "Name must be 2-100 characters")
    String customerName,
    
    @NotBlank(message = "Address is required")
    String customerAddress,
    
    @NotBlank(message = "Postal code is required")
    @Pattern(regexp = "\\d{4,10}", message = "Invalid postal code")
    String customerPostal,
    
    @NotBlank(message = "City is required")
    String customerCity,
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^\\+?[0-9\\s-]{8,20}$", message = "Invalid phone number")
    String customerPhone,
    
    @Email(message = "Invalid email format")
    String customerEmail,
    
    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    @Max(value = 1000, message = "Weight cannot exceed 1000 kg")
    Double weight
) {}
```

### 5.6 Prevent SQL Injection

```java
// ✅ Good - Parameterized query (JPA handles this)
@Query("SELECT p FROM Package p WHERE p.customerName = :name")
List<Package> findByName(@Param("name") String name);

// ❌ Bad - String concatenation (SQL injection risk!)
@Query("SELECT p FROM Package p WHERE p.customerName = '" + name + "'")
```

---

## 6. Error Handling

### 6.1 Global Exception Handler

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(404, ex.getMessage()));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .toList();
        
        log.warn("Validation failed: {}", errors);
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse(400, "Validation failed", errors));
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(new ErrorResponse(403, "Access denied"));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        log.error("Unexpected error", ex);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse(500, "An unexpected error occurred"));
    }
}
```

### 6.2 Custom Exceptions

```java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, String id) {
        super(String.format("%s with id '%s' not found", resource, id));
    }
}

public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}

public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
```

### 6.3 Error Response Format

```java
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

## 7. Logging

### 7.1 Use SLF4J with Lombok

```java
@Slf4j  // Lombok annotation
@Service
public class PackageServiceImpl implements PackageService {
    
    @Override
    public PackageResponse create(CreatePackageRequest request, UserDetails user) {
        log.info("Creating package for customer: {}", request.customerName());
        
        try {
            Package entity = packageMapper.toEntity(request);
            Package saved = packageRepository.save(entity);
            log.info("Package created with id: {}", saved.getId());
            return packageMapper.toResponse(saved);
        } catch (Exception e) {
            log.error("Failed to create package: {}", e.getMessage(), e);
            throw e;
        }
    }
}
```

### 7.2 Logging Levels

| Level | Usage |
|-------|-------|
| ERROR | Errors that need immediate attention |
| WARN | Potential problems |
| INFO | Important business events |
| DEBUG | Detailed information for debugging |
| TRACE | Very detailed (rarely used) |

```java
log.error("Payment failed for order {}: {}", orderId, e.getMessage(), e);
log.warn("Retry attempt {} for API call", retryCount);
log.info("Package {} status changed to {}", packageId, newStatus);
log.debug("Processing request with params: {}", params);
```

### 7.3 Logging Configuration

```yaml
# application.yml
logging:
  level:
    root: INFO
    com.logistics.packagemanagement: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG  # Show SQL queries
    org.hibernate.type.descriptor.sql: TRACE  # Show query parameters
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

### 7.4 Don't Log Sensitive Data

```java
// ❌ Bad - Logging sensitive data
log.info("User login: email={}, password={}", email, password);

// ✅ Good - No sensitive data
log.info("User login attempt: email={}", email);
log.info("User {} logged in successfully", userId);
```

---

## 8. Testing

### 8.1 Test Structure

```
src/test/java/com/logistics/packagemanagement/
├── controller/
│   └── PackageControllerTest.java      # Integration tests
├── service/
│   └── PackageServiceTest.java         # Unit tests
├── repository/
│   └── PackageRepositoryTest.java      # Repository tests
└── integration/
    └── PackageIntegrationTest.java     # Full integration tests
```

### 8.2 Unit Tests (Service Layer)

```java
@ExtendWith(MockitoExtension.class)
class PackageServiceTest {
    
    @Mock
    private PackageRepository packageRepository;
    
    @Mock
    private PackageMapper packageMapper;
    
    @InjectMocks
    private PackageServiceImpl packageService;
    
    @Test
    void create_ValidRequest_ReturnsPackageResponse() {
        // Arrange
        CreatePackageRequest request = new CreatePackageRequest(
            "John Doe", "Street 1", "1010", "Vienna", "+43123456", null, 2.5
        );
        Package entity = new Package();
        Package saved = new Package();
        saved.setId("123");
        PackageResponse expected = new PackageResponse("123", "John Doe", ...);
        
        when(packageMapper.toEntity(request)).thenReturn(entity);
        when(packageRepository.save(entity)).thenReturn(saved);
        when(packageMapper.toResponse(saved)).thenReturn(expected);
        
        // Act
        PackageResponse result = packageService.create(request);
        
        // Assert
        assertThat(result).isEqualTo(expected);
        verify(packageRepository).save(entity);
    }
    
    @Test
    void getById_NotFound_ThrowsException() {
        // Arrange
        when(packageRepository.findById("123")).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThrows(ResourceNotFoundException.class, 
            () -> packageService.getById("123"));
    }
}
```

### 8.3 Integration Tests (Controller)

```java
@SpringBootTest
@AutoConfigureMockMvc
class PackageControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockBean
    private PackageService packageService;
    
    @Test
    @WithMockUser(roles = "SELLER")
    void create_ValidRequest_Returns201() throws Exception {
        CreatePackageRequest request = new CreatePackageRequest(...);
        PackageResponse response = new PackageResponse(...);
        
        when(packageService.create(any(), any())).thenReturn(response);
        
        mockMvc.perform(post("/api/packages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(response.id()));
    }
    
    @Test
    @WithMockUser(roles = "SELLER")
    void create_InvalidRequest_Returns400() throws Exception {
        CreatePackageRequest request = new CreatePackageRequest(
            "", "", "", "", "", null, -1.0  // Invalid
        );
        
        mockMvc.perform(post("/api/packages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }
}
```

### 8.4 Repository Tests with Testcontainers

```java
@DataJpaTest
@Testcontainers
class PackageRepositoryTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");
    
    @Autowired
    private PackageRepository packageRepository;
    
    @Test
    void findBySellerId_ReturnsSellerPackages() {
        // Arrange
        Seller seller = createSeller();
        Package package1 = createPackage(seller);
        Package package2 = createPackage(seller);
        
        // Act
        List<Package> result = packageRepository.findBySellerIdOrderByCreatedAtDesc(seller.getId());
        
        // Assert
        assertThat(result).hasSize(2);
    }
}
```

### 8.5 Test Naming Convention

```java
// Pattern: methodName_condition_expectedResult

void create_ValidRequest_ReturnsPackageResponse()
void create_NullRequest_ThrowsException()
void getById_ExistingId_ReturnsPackage()
void getById_NonExistingId_ThrowsNotFoundException()
void updateStatus_AdminUser_UpdatesSuccessfully()
void updateStatus_SellerUser_ThrowsForbiddenException()
```

---

## 9. Frontend (React/Next.js)

### 9.1 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   ├── admin/
│   │   └── seller/
│   └── layout.tsx
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── forms/              # Form components
│   └── layout/             # Layout components
├── hooks/                  # Custom hooks
├── lib/                    # Utilities, API client
├── services/               # API service functions
├── types/                  # TypeScript types
└── store/                  # State management (if needed)
```

### 9.2 API Client

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
```

### 9.3 Type Safety

```typescript
// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SELLER';
}

export interface Package {
  id: string;
  customerName: string;
  customerAddress: string;
  customerPostal: string;
  customerCity: string;
  customerPhone: string;
  customerEmail?: string;
  weight: number;
  status: 'CREATED' | 'IN_STORAGE' | 'DISPATCHED';
  trackingNumber?: string;
  createdAt: string;
}

export interface CreatePackageRequest {
  customerName: string;
  customerAddress: string;
  customerPostal: string;
  customerCity: string;
  customerPhone: string;
  customerEmail?: string;
  weight: number;
}
```

### 9.4 Custom Hooks

```typescript
// hooks/usePackages.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packageService } from '@/services/package-service';

export function usePackages() {
  return useQuery({
    queryKey: ['packages'],
    queryFn: packageService.getAll,
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: packageService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}
```

### 9.5 Form Handling with React Hook Form

```typescript
// components/forms/PackageForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const packageSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerAddress: z.string().min(5, 'Address is required'),
  customerPostal: z.string().regex(/^\d{4,10}$/, 'Invalid postal code'),
  customerCity: z.string().min(2, 'City is required'),
  customerPhone: z.string().min(8, 'Phone is required'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  weight: z.number().positive('Weight must be positive'),
});

type PackageFormData = z.infer<typeof packageSchema>;

export function PackageForm({ onSubmit }: { onSubmit: (data: PackageFormData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('customerName')} placeholder="Customer Name" />
      {errors.customerName && <span>{errors.customerName.message}</span>}
      {/* ... other fields */}
    </form>
  );
}
```

### 9.6 Error Boundaries

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

---

## 10. Git Workflow

### 10.1 Branch Naming

```
main           # Production-ready code
develop        # Development branch
feature/xxx    # New features
bugfix/xxx     # Bug fixes
hotfix/xxx     # Urgent production fixes
```

**Examples:**
```
feature/user-authentication
feature/package-creation
bugfix/login-validation
hotfix/security-patch
```

### 10.2 Commit Messages

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
| Type | Usage |
|------|-------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation |
| style | Formatting (no code change) |
| refactor | Code restructure (no feature change) |
| test | Adding tests |
| chore | Build, config changes |

**Examples:**
```
feat(packages): add create package endpoint

fix(auth): fix JWT token expiration

docs(readme): add setup instructions

refactor(services): extract common validation logic

test(packages): add unit tests for PackageService
```

### 10.3 Pull Request Checklist

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Added/updated tests
- [ ] All tests pass
- [ ] Updated documentation
- [ ] No sensitive data exposed
```

---

## 11. Performance

### 11.1 Database Query Optimization

```java
// ✅ Good - Select only needed columns
@Query("SELECT new com.logistics.dto.PackageSummary(p.id, p.customerName, p.status) FROM Package p")
List<PackageSummary> findAllSummaries();

// ✅ Good - Use pagination
Page<Package> findAll(Pageable pageable);

// ✅ Good - Batch operations
@Modifying
@Query("UPDATE Package p SET p.status = :status WHERE p.id IN :ids")
int updateStatusBatch(@Param("status") PackageStatus status, @Param("ids") List<String> ids);
```

### 11.2 Caching (Future Enhancement)

```java
@Service
public class PackageServiceImpl {
    
    @Cacheable(value = "packages", key = "#id")
    public PackageResponse getById(String id) {
        // Cached result
    }
    
    @CacheEvict(value = "packages", key = "#id")
    public void delete(String id) {
        // Removes from cache
    }
    
    @CacheEvict(value = "packages", allEntries = true)
    public PackageResponse create(CreatePackageRequest request) {
        // Clears entire cache
    }
}
```

### 11.3 Connection Pooling

```yaml
# application.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      idle-timeout: 300000
      connection-timeout: 20000
```

---

## 12. Common Mistakes to Avoid

### 12.1 Backend Mistakes

```java
// ❌ Business logic in controller
@PostMapping
public ResponseEntity<?> create(@RequestBody Request request) {
    if (request.getName() == null) { }  // Should be in service or validation
}

// ❌ Returning entities directly
@GetMapping
public List<Package> getAll() {
    return packageRepository.findAll();  // Exposes internal structure
}

// ❌ Not using transactions
public void transfer() {
    accountA.withdraw(100);
    // If this fails, accountA already withdrew!
    accountB.deposit(100);
}

// ❌ Ignoring exceptions
try {
    doSomething();
} catch (Exception e) {
    // Silent fail - never do this!
}

// ❌ N+1 queries
packages.forEach(p -> p.getSeller().getName());  // Query per package

// ❌ Hardcoded values
String apiKey = "sk-12345";  // Use environment variables!
```

### 12.2 Frontend Mistakes

```typescript
// ❌ Not handling loading/error states
function PackageList() {
  const { data } = useQuery(...);
  return <div>{data.map(...)}</div>;  // Crashes if data is undefined
}

// ✅ Good
function PackageList() {
  const { data, isLoading, error } = useQuery(...);
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <div>{data?.map(...)}</div>;
}

// ❌ Storing sensitive data in localStorage
localStorage.setItem('user', JSON.stringify({ password: '123' }));

// ❌ Not validating on frontend (also validate on backend!)
const handleSubmit = () => {
  api.post('/packages', formData);  // No validation
};

// ❌ Prop drilling
<A><B><C><D prop={value}></D></C></B></A>  // Use context or state management
```

### 12.3 Security Mistakes

```java
// ❌ SQL injection vulnerability
String query = "SELECT * FROM users WHERE email = '" + email + "'";

// ❌ Exposing stack traces to users
@ExceptionHandler(Exception.class)
public ResponseEntity<?> handle(Exception e) {
    return ResponseEntity.status(500).body(e.getStackTrace());
}

// ❌ Weak password requirements
if (password.length() >= 4) { }  // Too weak!

// ❌ Not validating file uploads
public void upload(MultipartFile file) {
    file.transferTo(new File("/uploads/" + file.getOriginalFilename()));
    // Path traversal vulnerability!
}

// ❌ CORS allow all
@CrossOrigin(origins = "*")  // Too permissive for production
```

---

## Quick Reference Card

### Must Do ✅

- [ ] Use DTOs, never expose entities
- [ ] Validate all input (backend + frontend)
- [ ] Use constructor injection
- [ ] Handle exceptions globally
- [ ] Use transactions for write operations
- [ ] Log important events
- [ ] Use parameterized queries
- [ ] Hash passwords with BCrypt
- [ ] Use HTTPS in production
- [ ] Write tests

### Never Do ❌

- [ ] Business logic in controllers
- [ ] Ignore exceptions
- [ ] Log sensitive data
- [ ] Use EAGER fetch by default
- [ ] Trust user input
- [ ] Hardcode secrets
- [ ] Expose stack traces
- [ ] Use SELECT * in queries
- [ ] Skip input validation
- [ ] Commit sensitive files

---

## Resources

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Hibernate Best Practices](https://vladmihalcea.com/tutorials/hibernate/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Query](https://tanstack.com/query/latest)

---

Good luck building! 🚀
