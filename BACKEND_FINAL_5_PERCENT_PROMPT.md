# BlueLogistic Backend - Final 5% Completion Prompt

## 🎯 Objective

Complete the remaining 5% of the BlueLogistic Spring Boot backend. The core functionality is 100% working - we just need tests and documentation.

---

## 📋 Current State: 95% Complete

### ✅ Already Done (DO NOT MODIFY)
- All entities (User, Seller, Package)
- All repositories with queries
- All services (AuthService, SellerService, PackageService, JwtService)
- All controllers (AuthController, SellerController, PackageController)
- All DTOs (requests/responses)
- All mappers
- JWT authentication & security
- Exception handling
- Database migrations (Flyway)
- CORS configuration

### ❌ Remaining Tasks (DO THESE)
1. **Unit Tests** - AuthServiceTest, SellerServiceTest, PackageServiceTest
2. **Integration Tests** - AuthControllerTest (optional but recommended)
3. **README.md** - Setup instructions and API documentation

---

## 📁 Project Location

```
blue-logistic/
├── src/main/java/com/bluelogistic/
└── src/test/java/com/bluelogistic/   # Tests go here
```

---

## 🧪 Task 1: Unit Tests

### 1.1 Create AuthServiceTest

**File:** `src/test/java/com/bluelogistic/service/AuthServiceTest.java`

```java
package com.bluelogistic.service;

import com.bluelogistic.entity.User;
import com.bluelogistic.entity.enums.Role;
import com.bluelogistic.exception.BusinessException;
import com.bluelogistic.exception.ResourceNotFoundException;
import com.bluelogistic.exception.UnauthorizedException;
import com.bluelogistic.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId("user-123");
        testUser.setEmail("test@example.com");
        testUser.setPasswordHash("hashedPassword");
        testUser.setName("Test User");
        testUser.setRole(Role.SELLER);
    }

    @Test
    void authenticate_ValidCredentials_ReturnsUser() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);

        // Act
        User result = authService.authenticate("test@example.com", "password123");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("test@example.com");
        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    void authenticate_InvalidEmail_ThrowsUnauthorizedException() {
        // Arrange
        when(userRepository.findByEmail("wrong@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.authenticate("wrong@example.com", "password123"))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    void authenticate_InvalidPassword_ThrowsUnauthorizedException() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> authService.authenticate("test@example.com", "wrongPassword"))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    void getCurrentUser_ExistingUser_ReturnsUser() {
        // Arrange
        when(userRepository.findById("user-123")).thenReturn(Optional.of(testUser));

        // Act
        User result = authService.getCurrentUser("user-123");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("user-123");
    }

    @Test
    void getCurrentUser_NonExistingUser_ThrowsResourceNotFoundException() {
        // Arrange
        when(userRepository.findById("non-existing")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.getCurrentUser("non-existing"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void changePassword_ValidCurrentPassword_UpdatesPassword() {
        // Arrange
        when(userRepository.findById("user-123")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("currentPassword", "hashedPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("newHashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        authService.changePassword("user-123", "currentPassword", "newPassword");

        // Assert
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("newPassword");
    }

    @Test
    void changePassword_InvalidCurrentPassword_ThrowsBusinessException() {
        // Arrange
        when(userRepository.findById("user-123")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> authService.changePassword("user-123", "wrongPassword", "newPassword"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Current password is incorrect");
    }

    @Test
    void loadUserByUsername_ExistingEmail_ReturnsUserDetails() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        var result = authService.loadUserByUsername("test@example.com");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("test@example.com");
    }
}
```

---

### 1.2 Create SellerServiceTest

**File:** `src/test/java/com/bluelogistic/service/SellerServiceTest.java`

```java
package com.bluelogistic.service;

import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.User;
import com.bluelogistic.entity.enums.Role;
import com.bluelogistic.exception.BusinessException;
import com.bluelogistic.exception.ResourceNotFoundException;
import com.bluelogistic.repository.SellerRepository;
import com.bluelogistic.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SellerServiceTest {

    @Mock
    private SellerRepository sellerRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private SellerService sellerService;

    private User testUser;
    private Seller testSeller;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId("user-123");
        testUser.setEmail("seller@example.com");
        testUser.setPasswordHash("hashedPassword");
        testUser.setName("Test Seller");
        testUser.setRole(Role.SELLER);

        testSeller = new Seller();
        testSeller.setId("seller-123");
        testSeller.setUser(testUser);
        testSeller.setCompanyName("Test Company");
        testSeller.setActive(true);
    }

    @Test
    void createSeller_ValidData_ReturnsSeller() {
        // Arrange
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User user = inv.getArgument(0);
            user.setId("new-user-id");
            return user;
        });
        when(sellerRepository.save(any(Seller.class))).thenAnswer(inv -> {
            Seller seller = inv.getArgument(0);
            seller.setId("new-seller-id");
            return seller;
        });

        // Act
        Seller result = sellerService.createSeller("New Seller", "new@example.com", "password123", "New Company");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getCompanyName()).isEqualTo("New Company");
        verify(userRepository).save(any(User.class));
        verify(sellerRepository).save(any(Seller.class));
    }

    @Test
    void createSeller_DuplicateEmail_ThrowsBusinessException() {
        // Arrange
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> sellerService.createSeller("Name", "existing@example.com", "pass", "Company"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Email already exists");
    }

    @Test
    void getSellerById_ExistingSeller_ReturnsSeller() {
        // Arrange
        when(sellerRepository.findByIdWithUser("seller-123")).thenReturn(Optional.of(testSeller));

        // Act
        Seller result = sellerService.getSellerById("seller-123");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("seller-123");
    }

    @Test
    void getSellerById_NonExistingSeller_ThrowsResourceNotFoundException() {
        // Arrange
        when(sellerRepository.findByIdWithUser("non-existing")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> sellerService.getSellerById("non-existing"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getSellerByUserId_ExistingUser_ReturnsSeller() {
        // Arrange
        when(sellerRepository.findByUserId("user-123")).thenReturn(Optional.of(testSeller));

        // Act
        Seller result = sellerService.getSellerByUserId("user-123");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getUser().getId()).isEqualTo("user-123");
    }

    @Test
    void getAllSellers_ReturnsPageOfSellers() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Seller> expectedPage = new PageImpl<>(List.of(testSeller));
        when(sellerRepository.findAll(pageable)).thenReturn(expectedPage);

        // Act
        Page<Seller> result = sellerService.getAllSellers(pageable);

        // Assert
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getId()).isEqualTo("seller-123");
    }

    @Test
    void updateSellerStatus_ValidSeller_UpdatesStatus() {
        // Arrange
        when(sellerRepository.findById("seller-123")).thenReturn(Optional.of(testSeller));
        when(sellerRepository.save(any(Seller.class))).thenReturn(testSeller);

        // Act
        Seller result = sellerService.updateSellerStatus("seller-123", false);

        // Assert
        assertThat(result).isNotNull();
        verify(sellerRepository).save(any(Seller.class));
    }

    @Test
    void getActiveSellers_ReturnsOnlyActiveSellers() {
        // Arrange
        when(sellerRepository.findByIsActive(true)).thenReturn(List.of(testSeller));

        // Act
        List<Seller> result = sellerService.getActiveSellers();

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).isActive()).isTrue();
    }
}
```

---

### 1.3 Create PackageServiceTest

**File:** `src/test/java/com/bluelogistic/service/PackageServiceTest.java`

```java
package com.bluelogistic.service;

import com.bluelogistic.entity.Package;
import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.User;
import com.bluelogistic.entity.enums.PackageStatus;
import com.bluelogistic.entity.enums.Role;
import com.bluelogistic.exception.BusinessException;
import com.bluelogistic.exception.ResourceNotFoundException;
import com.bluelogistic.repository.PackageRepository;
import com.bluelogistic.repository.SellerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PackageServiceTest {

    @Mock
    private PackageRepository packageRepository;

    @Mock
    private SellerRepository sellerRepository;

    @InjectMocks
    private PackageService packageService;

    private User testUser;
    private Seller testSeller;
    private Package testPackage;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId("user-123");
        testUser.setEmail("seller@example.com");
        testUser.setName("Test Seller");
        testUser.setRole(Role.SELLER);

        testSeller = new Seller();
        testSeller.setId("seller-123");
        testSeller.setUser(testUser);
        testSeller.setCompanyName("Test Company");
        testSeller.setActive(true);

        testPackage = new Package();
        testPackage.setId("package-123");
        testPackage.setSeller(testSeller);
        testPackage.setCustomerName("John Doe");
        testPackage.setCustomerEmail("john@example.com");
        testPackage.setCustomerPhone("+1234567890");
        testPackage.setDeliveryAddress("123 Test St");
        testPackage.setDescription("Test Package");
        testPackage.setWeight(new BigDecimal("2.5"));
        testPackage.setStatus(PackageStatus.CREATED);
    }

    @Test
    void createPackage_ValidData_ReturnsPackage() {
        // Arrange
        when(sellerRepository.findById("seller-123")).thenReturn(Optional.of(testSeller));
        when(packageRepository.save(any(Package.class))).thenAnswer(inv -> {
            Package pkg = inv.getArgument(0);
            pkg.setId("new-package-id");
            return pkg;
        });

        Package newPackage = new Package();
        newPackage.setCustomerName("Jane Doe");
        newPackage.setDescription("New Package");
        newPackage.setWeight(new BigDecimal("1.5"));

        // Act
        Package result = packageService.createPackage("seller-123", newPackage);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getSeller().getId()).isEqualTo("seller-123");
        assertThat(result.getStatus()).isEqualTo(PackageStatus.CREATED);
        verify(packageRepository).save(any(Package.class));
    }

    @Test
    void createPackage_InactiveSeller_ThrowsBusinessException() {
        // Arrange
        testSeller.setActive(false);
        when(sellerRepository.findById("seller-123")).thenReturn(Optional.of(testSeller));

        Package newPackage = new Package();

        // Act & Assert
        assertThatThrownBy(() -> packageService.createPackage("seller-123", newPackage))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Seller is not active");
    }

    @Test
    void createPackage_NonExistingSeller_ThrowsResourceNotFoundException() {
        // Arrange
        when(sellerRepository.findById("non-existing")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> packageService.createPackage("non-existing", new Package()))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getPackageById_ExistingPackage_ReturnsPackage() {
        // Arrange
        when(packageRepository.findByIdWithSeller("package-123")).thenReturn(Optional.of(testPackage));

        // Act
        Package result = packageService.getPackageById("package-123");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("package-123");
    }

    @Test
    void getPackageById_NonExistingPackage_ThrowsResourceNotFoundException() {
        // Arrange
        when(packageRepository.findByIdWithSeller("non-existing")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> packageService.getPackageById("non-existing"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updatePackageStatus_ValidTransition_CreatedToInStorage_UpdatesStatus() {
        // Arrange
        testPackage.setStatus(PackageStatus.CREATED);
        when(packageRepository.findById("package-123")).thenReturn(Optional.of(testPackage));
        when(packageRepository.save(any(Package.class))).thenReturn(testPackage);

        // Act
        Package result = packageService.updatePackageStatus("package-123", PackageStatus.IN_STORAGE);

        // Assert
        assertThat(result.getStatus()).isEqualTo(PackageStatus.IN_STORAGE);
        verify(packageRepository).save(any(Package.class));
    }

    @Test
    void updatePackageStatus_ValidTransition_InStorageToDispatched_UpdatesStatus() {
        // Arrange
        testPackage.setStatus(PackageStatus.IN_STORAGE);
        when(packageRepository.findById("package-123")).thenReturn(Optional.of(testPackage));
        when(packageRepository.save(any(Package.class))).thenReturn(testPackage);

        // Act
        Package result = packageService.updatePackageStatus("package-123", PackageStatus.DISPATCHED);

        // Assert
        assertThat(result.getStatus()).isEqualTo(PackageStatus.DISPATCHED);
    }

    @Test
    void updatePackageStatus_InvalidTransition_CreatedToDispatched_ThrowsBusinessException() {
        // Arrange
        testPackage.setStatus(PackageStatus.CREATED);
        when(packageRepository.findById("package-123")).thenReturn(Optional.of(testPackage));

        // Act & Assert
        assertThatThrownBy(() -> packageService.updatePackageStatus("package-123", PackageStatus.DISPATCHED))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Invalid status transition");
    }

    @Test
    void updatePackageStatus_InvalidTransition_DispatchedToAny_ThrowsBusinessException() {
        // Arrange
        testPackage.setStatus(PackageStatus.DISPATCHED);
        when(packageRepository.findById("package-123")).thenReturn(Optional.of(testPackage));

        // Act & Assert
        assertThatThrownBy(() -> packageService.updatePackageStatus("package-123", PackageStatus.IN_STORAGE))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Invalid status transition");
    }

    @Test
    void updateTrackingNumber_ValidPackage_UpdatesTracking() {
        // Arrange
        testPackage.setStatus(PackageStatus.IN_STORAGE);
        when(packageRepository.findById("package-123")).thenReturn(Optional.of(testPackage));
        when(packageRepository.existsByTrackingNumber("TRACK123")).thenReturn(false);
        when(packageRepository.save(any(Package.class))).thenReturn(testPackage);

        // Act
        Package result = packageService.updateTrackingNumber("package-123", "TRACK123");

        // Assert
        assertThat(result.getTrackingNumber()).isEqualTo("TRACK123");
        assertThat(result.getStatus()).isEqualTo(PackageStatus.DISPATCHED);
        verify(packageRepository).save(any(Package.class));
    }

    @Test
    void updateTrackingNumber_DuplicateTracking_ThrowsBusinessException() {
        // Arrange
        testPackage.setStatus(PackageStatus.IN_STORAGE);
        when(packageRepository.findById("package-123")).thenReturn(Optional.of(testPackage));
        when(packageRepository.existsByTrackingNumber("DUPLICATE")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> packageService.updateTrackingNumber("package-123", "DUPLICATE"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Tracking number already exists");
    }

    @Test
    void updateTrackingNumber_CreatedStatus_ThrowsBusinessException() {
        // Arrange
        testPackage.setStatus(PackageStatus.CREATED);
        when(packageRepository.findById("package-123")).thenReturn(Optional.of(testPackage));

        // Act & Assert
        assertThatThrownBy(() -> packageService.updateTrackingNumber("package-123", "TRACK123"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Tracking number can only be added");
    }

    @Test
    void deletePackage_CreatedStatus_DeletesPackage() {
        // Arrange
        testPackage.setStatus(PackageStatus.CREATED);
        when(packageRepository.findById("package-123")).thenReturn(Optional.of(testPackage));
        doNothing().when(packageRepository).deleteById("package-123");

        // Act
        packageService.deletePackage("package-123");

        // Assert
        verify(packageRepository).deleteById("package-123");
    }

    @Test
    void deletePackage_NonCreatedStatus_ThrowsBusinessException() {
        // Arrange
        testPackage.setStatus(PackageStatus.IN_STORAGE);
        when(packageRepository.findById("package-123")).thenReturn(Optional.of(testPackage));

        // Act & Assert
        assertThatThrownBy(() -> packageService.deletePackage("package-123"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Only packages with CREATED status can be deleted");
    }

    @Test
    void getPackages_ReturnsPageOfPackages() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Package> expectedPage = new PageImpl<>(List.of(testPackage));
        when(packageRepository.findAll(pageable)).thenReturn(expectedPage);

        // Act
        Page<Package> result = packageService.getPackages(pageable);

        // Assert
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    void getPackagesBySeller_ReturnsSellerPackages() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Package> expectedPage = new PageImpl<>(List.of(testPackage));
        when(packageRepository.findBySellerId("seller-123", pageable)).thenReturn(expectedPage);

        // Act
        Page<Package> result = packageService.getPackagesBySeller("seller-123", pageable);

        // Assert
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getSeller().getId()).isEqualTo("seller-123");
    }

    @Test
    void getPackagesByStatus_ReturnsFilteredPackages() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Package> expectedPage = new PageImpl<>(List.of(testPackage));
        when(packageRepository.findByStatus(PackageStatus.CREATED, pageable)).thenReturn(expectedPage);

        // Act
        Page<Package> result = packageService.getPackagesByStatus(PackageStatus.CREATED, pageable);

        // Assert
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getStatus()).isEqualTo(PackageStatus.CREATED);
    }
}
```

---

## 🧪 Task 2: Integration Test (Optional but Recommended)

### 2.1 Create AuthControllerTest

**File:** `src/test/java/com/bluelogistic/controller/AuthControllerTest.java`

```java
package com.bluelogistic.controller;

import com.bluelogistic.dto.LoginRequest;
import com.bluelogistic.dto.ChangePasswordRequest;
import com.bluelogistic.entity.User;
import com.bluelogistic.entity.enums.Role;
import com.bluelogistic.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setPasswordHash(passwordEncoder.encode("password123"));
        testUser.setName("Test User");
        testUser.setRole(Role.ADMIN);
        userRepository.save(testUser);
    }

    @Test
    void login_ValidCredentials_ReturnsToken() throws Exception {
        LoginRequest request = new LoginRequest("test@example.com", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    void login_InvalidCredentials_Returns401() throws Exception {
        LoginRequest request = new LoginRequest("test@example.com", "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void login_InvalidEmail_Returns401() throws Exception {
        LoginRequest request = new LoginRequest("nonexistent@example.com", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void login_InvalidRequestBody_Returns400() throws Exception {
        LoginRequest request = new LoginRequest("", "");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getCurrentUser_WithValidToken_ReturnsUser() throws Exception {
        // First, login to get token
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn();

        String response = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(response).get("token").asText();

        // Then, call /me endpoint
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.name").value("Test User"));
    }

    @Test
    void getCurrentUser_WithoutToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void changePassword_ValidRequest_Returns204() throws Exception {
        // First, login to get token
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn();

        String response = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(response).get("token").asText();

        // Then, change password
        ChangePasswordRequest changeRequest = new ChangePasswordRequest("password123", "newPassword123");

        mockMvc.perform(patch("/api/auth/password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(changeRequest)))
                .andExpect(status().isNoContent());
    }
}
```

---

## 📄 Task 3: Update README.md

**File:** `blue-logistic/README.md`

```markdown
# BlueLogistic - Package Management Platform

A comprehensive package management platform for logistics companies working with multiple sellers.

## 🚀 Features

- **User Authentication** - JWT-based authentication with role-based access
- **Admin Dashboard** - View all packages, manage status, add tracking numbers
- **Seller Dashboard** - Create packages, view own packages and tracking
- **Status Workflow** - CREATED → IN_STORAGE → DISPATCHED
- **Package Management** - Full CRUD operations with validation

## 🛠️ Tech Stack

- **Framework**: Spring Boot 3.5.9
- **Language**: Java 21
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA + Hibernate
- **Auth**: Spring Security + JWT
- **Migration**: Flyway
- **Build**: Maven

## 📋 Prerequisites

- Java 21+
- PostgreSQL 15+
- Maven 3.9+

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd blue-logistic
```

### 2. Create PostgreSQL database

```sql
CREATE DATABASE bluelogistic;
CREATE USER bluelogistic WITH PASSWORD 'bluelogistic123';
GRANT ALL PRIVILEGES ON DATABASE bluelogistic TO bluelogistic;
```

### 3. Configure environment (optional)

Default configuration uses:
- Database: `localhost:5432/bluelogistic`
- Username: `bluelogistic`
- Password: `bluelogistic123`

To customize, set environment variables or edit `application-dev.yml`.

### 4. Run the application

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

The API will be available at `http://localhost:8080`

## 🔐 Default Admin Account

- **Email**: admin@bluelogistic.com
- **Password**: admin123

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | Required |
| PATCH | `/api/auth/password` | Change password | Required |

### Packages

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/packages` | List packages | All |
| POST | `/api/packages` | Create package | SELLER |
| GET | `/api/packages/{id}` | Get package | All |
| PATCH | `/api/packages/{id}/status` | Update status | ADMIN |
| PATCH | `/api/packages/{id}/tracking` | Add tracking | ADMIN |
| DELETE | `/api/packages/{id}` | Delete package | ADMIN |

### Sellers (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sellers` | List sellers |
| POST | `/api/sellers` | Create seller |
| GET | `/api/sellers/{id}` | Get seller |
| PATCH | `/api/sellers/{id}/status` | Update status |
| GET | `/api/sellers/{id}/packages` | Get seller's packages |

## 📦 Package Status Workflow

```
CREATED  →  IN_STORAGE  →  DISPATCHED
  ↑            ↑              ↑
Seller      Admin          Admin
creates    receives     ships + tracking
```

## 🧪 Testing

### Run all tests
```bash
./mvnw test
```

### Run with coverage
```bash
./mvnw test jacoco:report
```

## 📁 Project Structure

```
src/main/java/com/bluelogistic/
├── config/          # Security, JWT configuration
├── controller/      # REST controllers
├── dto/             # Request/Response DTOs
├── entity/          # JPA entities
├── exception/       # Custom exceptions + handler
├── mapper/          # Entity ↔ DTO mappers
├── repository/      # Data access layer
└── service/         # Business logic
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | jdbc:postgresql://localhost:5432/bluelogistic | Database URL |
| `DB_USERNAME` | bluelogistic | Database username |
| `DB_PASSWORD` | bluelogistic123 | Database password |
| `JWT_SECRET` | (auto-generated) | JWT signing key |

## 📝 API Examples

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bluelogistic.com","password":"admin123"}'
```

### Create Seller (as Admin)
```bash
curl -X POST http://localhost:8080/api/sellers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "John Seller",
    "email": "john@example.com",
    "password": "password123",
    "companyName": "Johns Shop"
  }'
```

### Create Package (as Seller)
```bash
curl -X POST http://localhost:8080/api/packages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "description": "Electronics",
    "weight": 2.5,
    "customerName": "Jane Doe",
    "customerEmail": "jane@example.com",
    "customerPhone": "+1234567890",
    "deliveryAddress": "123 Main St, City"
  }'
```

## 📄 License

This project is proprietary software.
```

---

## ✅ Verification Commands

After implementing all tasks, run these commands:

```bash
# 1. Compile the project
cd blue-logistic
./mvnw clean compile

# 2. Run all tests
./mvnw test

# 3. Check test results
# Look for "Tests run: X, Failures: 0, Errors: 0"

# 4. Start the application
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# 5. Test login endpoint
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bluelogistic.com","password":"admin123"}'
```

---

## ⚠️ Important Notes

1. **DO NOT MODIFY** existing working files - only add test files and README
2. Create `src/test/resources/application-test.yml` if needed for integration tests
3. All tests should pass before considering the backend complete
4. Tests follow the naming convention: `methodName_condition_expectedResult`

---

## 📊 Expected Test Results

After completion, running `./mvnw test` should show:

```
Tests run: ~25-30
Failures: 0
Errors: 0
```

**Backend is 100% complete when all tests pass! 🎉**
