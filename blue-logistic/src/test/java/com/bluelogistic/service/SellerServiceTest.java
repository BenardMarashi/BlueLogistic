package com.bluelogistic.service;

import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.User;
import com.bluelogistic.entity.enums.Role;
import com.bluelogistic.exception.BusinessException;
import com.bluelogistic.exception.DuplicateResourceException;
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
import java.util.UUID;

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

    @Mock
    private AuditService auditService;

    @InjectMocks
    private SellerService sellerService;

    private User testUser;
    private Seller testSeller;
    private UUID testUserId;
    private UUID testSellerId;

    @BeforeEach
    void setUp() {
        testUserId = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");
        testSellerId = UUID.fromString("660e8400-e29b-41d4-a716-446655440001");
        
        testUser = new User();
        testUser.setId(testUserId);
        testUser.setEmail("seller@example.com");
        testUser.setPasswordHash("hashedPassword");
        testUser.setName("Test Seller");
        testUser.setRole(Role.SELLER);

        testSeller = new Seller();
        testSeller.setId(testSellerId);
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
            user.setId(UUID.randomUUID());
            return user;
        });
        when(sellerRepository.save(any(Seller.class))).thenAnswer(inv -> {
            Seller seller = inv.getArgument(0);
            seller.setId(UUID.randomUUID());
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
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Email already exists");
    }

    @Test
    void getSellerById_ExistingSeller_ReturnsSeller() {
        // Arrange
        when(sellerRepository.findByIdWithUser(testSellerId)).thenReturn(Optional.of(testSeller));

        // Act
        Seller result = sellerService.getSellerById(testSellerId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(testSellerId);
    }

    @Test
    void getSellerById_NonExistingSeller_ThrowsResourceNotFoundException() {
        // Arrange
        UUID nonExistingId = UUID.fromString("123e4567-e89b-12d3-a456-426614174000");
        when(sellerRepository.findByIdWithUser(nonExistingId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> sellerService.getSellerById(nonExistingId))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getSellerByUserId_ExistingUser_ReturnsSeller() {
        // Arrange
        when(sellerRepository.findByUserId(testUserId)).thenReturn(Optional.of(testSeller));

        // Act
        Seller result = sellerService.getSellerByUserId(testUserId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getUser().getId()).isEqualTo(testUserId);
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
        assertThat(result.getContent().get(0).getId()).isEqualTo(testSellerId);
    }

    @Test
    void updateSellerStatus_ValidSeller_UpdatesStatus() {
        // Arrange
        when(sellerRepository.findById(testSellerId)).thenReturn(Optional.of(testSeller));
        when(sellerRepository.save(any(Seller.class))).thenReturn(testSeller);

        // Act
        Seller result = sellerService.updateSellerStatus(testSellerId, false);

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