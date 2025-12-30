package com.bluelogistic.service;

import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.User;
import com.bluelogistic.entity.enums.Role;
import com.bluelogistic.exception.BusinessException;
import com.bluelogistic.exception.ResourceNotFoundException;
import com.bluelogistic.exception.DuplicateResourceException;
import com.bluelogistic.repository.SellerRepository;
import com.bluelogistic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SellerService {
    
    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public Seller createSeller(String name, String email, String password, String companyName) {
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already exists: " + email);
        }
        
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(Role.SELLER);
        
        User savedUser = userRepository.save(user);
        
        Seller seller = new Seller();
        seller.setUser(savedUser);
        seller.setCompanyName(companyName);
        seller.setActive(true);
        
        Seller savedSeller = sellerRepository.save(seller);
        log.info("Seller created with ID: {} for user: {}", savedSeller.getId(), email);
        
        return savedSeller;
    }
    
    public Seller getSellerById(UUID sellerId) {
        return sellerRepository.findByIdWithUser(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "id", sellerId.toString()));
    }
    
    public Seller getSellerByUserId(UUID userId) {
        return sellerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "userId", userId.toString()));
    }
    
    public Page<Seller> getAllSellers(Pageable pageable) {
        return sellerRepository.findAll(pageable);
    }
    
    public List<Seller> getActiveSellers() {
        return sellerRepository.findByIsActive(true);
    }
    
    @Transactional
    public Seller updateSellerStatus(UUID sellerId, boolean isActive) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "id", sellerId.toString()));
        
        seller.setActive(isActive);
        Seller updatedSeller = sellerRepository.save(seller);
        
        log.info("Seller {} status updated to active: {}", sellerId, isActive);
        return updatedSeller;
    }
    
    @Transactional
    public Seller updateSellerInfo(UUID sellerId, String companyName) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "id", sellerId.toString()));
        
        seller.setCompanyName(companyName);
        Seller updatedSeller = sellerRepository.save(seller);
        
        log.info("Seller {} info updated", sellerId);
        return updatedSeller;
    }
}