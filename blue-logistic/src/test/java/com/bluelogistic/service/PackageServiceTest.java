package com.bluelogistic.service;

import com.bluelogistic.dto.PriceCalculationResult;
import com.bluelogistic.entity.Package;
import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.User;
import com.bluelogistic.entity.enums.PackageStatus;
import com.bluelogistic.entity.enums.Role;
import com.bluelogistic.exception.BusinessException;
import com.bluelogistic.exception.InvalidStatusTransitionException;
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
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PackageServiceTest {

    @Mock
    private PackageRepository packageRepository;

    @Mock
    private SellerRepository sellerRepository;

    @Mock
    private PricingService pricingService;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private PackageService packageService;

    private User testUser;
    private Seller testSeller;
    private Package testPackage;
    private UUID testUserId;
    private UUID testSellerId;
    private UUID testPackageId;

    @BeforeEach
    void setUp() {
        testUserId = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");
        testSellerId = UUID.fromString("660e8400-e29b-41d4-a716-446655440001");
        testPackageId = UUID.fromString("770e8400-e29b-41d4-a716-446655440002");
        
        testUser = new User();
        testUser.setId(testUserId);
        testUser.setEmail("seller@example.com");
        testUser.setName("Test Seller");
        testUser.setRole(Role.SELLER);

        testSeller = new Seller();
        testSeller.setId(testSellerId);
        testSeller.setUser(testUser);
        testSeller.setCompanyName("Test Company");
        testSeller.setActive(true);

        testPackage = new Package();
        testPackage.setId(testPackageId);
        testPackage.setSeller(testSeller);
        testPackage.setCustomerName("John Doe");
        testPackage.setCustomerEmail("john@example.com");
        testPackage.setCustomerPhone("+1234567890");
        testPackage.setDeliveryAddress("123 Test St");
        testPackage.setDescription("Test Package");
        testPackage.setWeight(new BigDecimal("2.5"));
        testPackage.setStatus(PackageStatus.CREATED);
        testPackage.setDestinationCountry("AT");
    }

    @Test
    void createPackage_ValidData_ReturnsPackage() {
        // Arrange
        when(sellerRepository.findById(testSellerId)).thenReturn(Optional.of(testSeller));
        when(pricingService.calculateOptimalPrice(anyString(), anyDouble()))
            .thenReturn(new PriceCalculationResult(new BigDecimal("3.15"), new BigDecimal("6.30"), "1×1.5kg"));
        when(packageRepository.save(any(Package.class))).thenAnswer(inv -> {
            Package pkg = inv.getArgument(0);
            pkg.setId(UUID.randomUUID());
            return pkg;
        });

        Package newPackage = new Package();
        newPackage.setCustomerName("Jane Doe");
        newPackage.setDescription("New Package");
        newPackage.setWeight(new BigDecimal("1.5"));
        newPackage.setDestinationCountry("AT");

        // Act
        Package result = packageService.createPackage(testSellerId, newPackage);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getSeller().getId()).isEqualTo(testSellerId);
        assertThat(result.getStatus()).isEqualTo(PackageStatus.CREATED);
        assertThat(result.getCostPrice()).isEqualTo(new BigDecimal("3.15"));
        assertThat(result.getSellerPrice()).isEqualTo(new BigDecimal("6.30"));
        verify(packageRepository).save(any(Package.class));
    }

    @Test
    void createPackage_InactiveSeller_ThrowsBusinessException() {
        // Arrange
        testSeller.setActive(false);
        when(sellerRepository.findById(testSellerId)).thenReturn(Optional.of(testSeller));

        Package newPackage = new Package();

        // Act & Assert
        assertThatThrownBy(() -> packageService.createPackage(testSellerId, newPackage))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Seller is not active");
    }

    @Test
    void createPackage_NonExistingSeller_ThrowsResourceNotFoundException() {
        // Arrange
        UUID nonExistingId = UUID.fromString("123e4567-e89b-12d3-a456-426614174000");
        when(sellerRepository.findById(nonExistingId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> packageService.createPackage(nonExistingId, new Package()))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getPackageById_ExistingPackage_ReturnsPackage() {
        // Arrange
        when(packageRepository.findByIdWithSeller(testPackageId)).thenReturn(Optional.of(testPackage));

        // Act
        Package result = packageService.getPackageById(testPackageId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(testPackageId);
    }

    @Test
    void getPackageById_NonExistingPackage_ThrowsResourceNotFoundException() {
        // Arrange
        UUID nonExistingId = UUID.fromString("123e4567-e89b-12d3-a456-426614174000");
        when(packageRepository.findByIdWithSeller(nonExistingId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> packageService.getPackageById(nonExistingId))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updatePackageStatus_ValidTransition_CreatedToInStorage_UpdatesStatus() {
        // Arrange
        testPackage.setStatus(PackageStatus.CREATED);
        when(packageRepository.findByIdWithSeller(testPackageId)).thenReturn(Optional.of(testPackage));
        when(packageRepository.save(any(Package.class))).thenReturn(testPackage);

        // Act
        Package result = packageService.updatePackageStatus(testPackageId, PackageStatus.IN_STORAGE);

        // Assert
        assertThat(result.getStatus()).isEqualTo(PackageStatus.IN_STORAGE);
        verify(packageRepository).save(any(Package.class));
    }

    @Test
    void updatePackageStatus_ValidTransition_InStorageToDispatched_UpdatesStatus() {
        // Arrange
        testPackage.setStatus(PackageStatus.IN_STORAGE);
        when(packageRepository.findByIdWithSeller(testPackageId)).thenReturn(Optional.of(testPackage));
        when(packageRepository.save(any(Package.class))).thenReturn(testPackage);

        // Act
        Package result = packageService.updatePackageStatus(testPackageId, PackageStatus.DISPATCHED);

        // Assert
        assertThat(result.getStatus()).isEqualTo(PackageStatus.DISPATCHED);
    }

    @Test
    void updatePackageStatus_InvalidTransition_CreatedToDispatched_ThrowsBusinessException() {
        // Arrange
        testPackage.setStatus(PackageStatus.CREATED);
        when(packageRepository.findByIdWithSeller(testPackageId)).thenReturn(Optional.of(testPackage));

        // Act & Assert
        assertThatThrownBy(() -> packageService.updatePackageStatus(testPackageId, PackageStatus.DISPATCHED))
                .isInstanceOf(InvalidStatusTransitionException.class)
                .hasMessageContaining("Invalid status transition");
    }

    @Test
    void updatePackageStatus_InvalidTransition_DispatchedToAny_ThrowsBusinessException() {
        // Arrange
        testPackage.setStatus(PackageStatus.DISPATCHED);
        when(packageRepository.findByIdWithSeller(testPackageId)).thenReturn(Optional.of(testPackage));

        // Act & Assert
        assertThatThrownBy(() -> packageService.updatePackageStatus(testPackageId, PackageStatus.IN_STORAGE))
                .isInstanceOf(InvalidStatusTransitionException.class)
                .hasMessageContaining("Invalid status transition");
    }

    @Test
    void updateTrackingNumber_ValidPackage_UpdatesTracking() {
        // Arrange
        testPackage.setStatus(PackageStatus.IN_STORAGE);
        when(packageRepository.findByIdWithSeller(testPackageId)).thenReturn(Optional.of(testPackage));
        when(packageRepository.existsByTrackingNumber("TRACK123")).thenReturn(false);
        when(packageRepository.save(any(Package.class))).thenReturn(testPackage);

        // Act
        Package result = packageService.updateTrackingNumber(testPackageId, "TRACK123");

        // Assert
        assertThat(result.getTrackingNumber()).isEqualTo("TRACK123");
        assertThat(result.getStatus()).isEqualTo(PackageStatus.DISPATCHED);
        verify(packageRepository).save(any(Package.class));
    }

    @Test
    void updateTrackingNumber_DuplicateTracking_ThrowsBusinessException() {
        // Arrange
        testPackage.setStatus(PackageStatus.IN_STORAGE);
        when(packageRepository.findByIdWithSeller(testPackageId)).thenReturn(Optional.of(testPackage));
        when(packageRepository.existsByTrackingNumber("DUPLICATE")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> packageService.updateTrackingNumber(testPackageId, "DUPLICATE"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Tracking number already exists");
    }

    @Test
    void updateTrackingNumber_CreatedStatus_ThrowsBusinessException() {
        // Arrange
        testPackage.setStatus(PackageStatus.CREATED);
        when(packageRepository.findByIdWithSeller(testPackageId)).thenReturn(Optional.of(testPackage));

        // Act & Assert
        assertThatThrownBy(() -> packageService.updateTrackingNumber(testPackageId, "TRACK123"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Tracking number can only be added");
    }

    @Test
    void deletePackage_CreatedStatus_DeletesPackage() {
        // Arrange
        testPackage.setStatus(PackageStatus.CREATED);
        when(packageRepository.findById(testPackageId)).thenReturn(Optional.of(testPackage));
        doNothing().when(packageRepository).deleteById(testPackageId);

        // Act
        packageService.deletePackage(testPackageId);

        // Assert
        verify(packageRepository).deleteById(testPackageId);
    }

    @Test
    void deletePackage_NonCreatedStatus_ThrowsBusinessException() {
        // Arrange
        testPackage.setStatus(PackageStatus.IN_STORAGE);
        when(packageRepository.findById(testPackageId)).thenReturn(Optional.of(testPackage));

        // Act & Assert
        assertThatThrownBy(() -> packageService.deletePackage(testPackageId))
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
        when(packageRepository.findBySellerId(testSellerId, pageable)).thenReturn(expectedPage);

        // Act
        Page<Package> result = packageService.getPackagesBySeller(testSellerId, pageable);

        // Assert
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getSeller().getId()).isEqualTo(testSellerId);
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