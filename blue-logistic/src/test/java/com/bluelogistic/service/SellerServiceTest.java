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
                .isInstanceOf(DuplicateResourceException.class)
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