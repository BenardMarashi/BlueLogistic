package com.bluelogistic.service;

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
                .isInstanceOf(InvalidStatusTransitionException.class)
                .hasMessageContaining("Invalid status transition");
    }

    @Test
    void updatePackageStatus_InvalidTransition_DispatchedToAny_ThrowsBusinessException() {
        // Arrange
        testPackage.setStatus(PackageStatus.DISPATCHED);
        when(packageRepository.findById("package-123")).thenReturn(Optional.of(testPackage));

        // Act & Assert
        assertThatThrownBy(() -> packageService.updatePackageStatus("package-123", PackageStatus.IN_STORAGE))
                .isInstanceOf(InvalidStatusTransitionException.class)
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