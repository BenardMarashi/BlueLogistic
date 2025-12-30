# BlueLogistic Backend - Complete the Tests

## Context
The BlueLogistic Spring Boot backend is 95% complete. All core functionality works. 
Your task: Add unit tests and update README.

## Files to Create

### 1. `src/test/java/com/bluelogistic/service/AuthServiceTest.java`
Create unit tests for AuthService with these test cases:
- `authenticate_ValidCredentials_ReturnsUser`
- `authenticate_InvalidEmail_ThrowsUnauthorizedException`
- `authenticate_InvalidPassword_ThrowsUnauthorizedException`
- `getCurrentUser_ExistingUser_ReturnsUser`
- `getCurrentUser_NonExistingUser_ThrowsResourceNotFoundException`
- `changePassword_ValidCurrentPassword_UpdatesPassword`
- `changePassword_InvalidCurrentPassword_ThrowsBusinessException`
- `loadUserByUsername_ExistingEmail_ReturnsUserDetails`

Use: `@ExtendWith(MockitoExtension.class)`, `@Mock`, `@InjectMocks`, AssertJ assertions

### 2. `src/test/java/com/bluelogistic/service/SellerServiceTest.java`
Create unit tests for SellerService with these test cases:
- `createSeller_ValidData_ReturnsSeller`
- `createSeller_DuplicateEmail_ThrowsBusinessException`
- `getSellerById_ExistingSeller_ReturnsSeller`
- `getSellerById_NonExistingSeller_ThrowsResourceNotFoundException`
- `getSellerByUserId_ExistingUser_ReturnsSeller`
- `getAllSellers_ReturnsPageOfSellers`
- `updateSellerStatus_ValidSeller_UpdatesStatus`
- `getActiveSellers_ReturnsOnlyActiveSellers`

### 3. `src/test/java/com/bluelogistic/service/PackageServiceTest.java`
Create unit tests for PackageService with these test cases:
- `createPackage_ValidData_ReturnsPackage`
- `createPackage_InactiveSeller_ThrowsBusinessException`
- `createPackage_NonExistingSeller_ThrowsResourceNotFoundException`
- `getPackageById_ExistingPackage_ReturnsPackage`
- `getPackageById_NonExistingPackage_ThrowsResourceNotFoundException`
- `updatePackageStatus_ValidTransition_CreatedToInStorage_UpdatesStatus`
- `updatePackageStatus_ValidTransition_InStorageToDispatched_UpdatesStatus`
- `updatePackageStatus_InvalidTransition_CreatedToDispatched_ThrowsBusinessException`
- `updatePackageStatus_InvalidTransition_DispatchedToAny_ThrowsBusinessException`
- `updateTrackingNumber_ValidPackage_UpdatesTracking`
- `updateTrackingNumber_DuplicateTracking_ThrowsBusinessException`
- `updateTrackingNumber_CreatedStatus_ThrowsBusinessException`
- `deletePackage_CreatedStatus_DeletesPackage`
- `deletePackage_NonCreatedStatus_ThrowsBusinessException`
- `getPackages_ReturnsPageOfPackages`
- `getPackagesBySeller_ReturnsSellerPackages`
- `getPackagesByStatus_ReturnsFilteredPackages`

### 4. Update `README.md`
Update the README with:
- Project description
- Prerequisites (Java 21, PostgreSQL, Maven)
- Setup instructions (database creation, running)
- Default admin credentials
- API endpoint table
- Status workflow diagram
- Example curl commands

## Test Dependencies Already in pom.xml
- spring-boot-starter-test
- spring-security-test
- Mockito (included)
- JUnit 5 (included)
- AssertJ (included)

## Optional: For Integration Tests Add H2 to pom.xml
```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

## Optional: Create `src/test/resources/application-test.yml`
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop
  flyway:
    enabled: false

application:
  security:
    jwt:
      secret-key: testsecretkeytestsecretkeytestsecretkeytestsecretkey1234567890
      expiration: 86400000
```

## Commands to Verify
```bash
cd blue-logistic
./mvnw clean compile
./mvnw test
```

## Rules
- DO NOT modify any existing Java files
- Only CREATE new test files
- Only UPDATE README.md
- Use AssertJ for assertions: `assertThat()`, `assertThatThrownBy()`
- Mock all dependencies with `@Mock`
- Follow test naming: `methodName_condition_expectedResult`
