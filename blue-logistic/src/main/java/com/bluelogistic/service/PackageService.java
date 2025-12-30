package com.bluelogistic.service;

import com.bluelogistic.entity.Package;
import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.enums.PackageStatus;
import com.bluelogistic.exception.BusinessException;
import com.bluelogistic.exception.ResourceNotFoundException;
import com.bluelogistic.repository.PackageRepository;
import com.bluelogistic.repository.SellerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PackageService {
    
    private final PackageRepository packageRepository;
    private final SellerRepository sellerRepository;
    
    @Transactional
    public Package createPackage(String sellerId, Package packageData) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "id", sellerId));
        
        if (!seller.isActive()) {
            throw new BusinessException("Seller is not active");
        }
        
        packageData.setSeller(seller);
        packageData.setStatus(PackageStatus.CREATED);
        
        Package savedPackage = packageRepository.save(packageData);
        log.info("Package created with ID: {} for seller: {}", savedPackage.getId(), sellerId);
        
        return savedPackage;
    }
    
    public Package getPackageById(String packageId) {
        return packageRepository.findByIdWithSeller(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package", "id", packageId));
    }
    
    public Page<Package> getPackages(Pageable pageable) {
        return packageRepository.findAll(pageable);
    }
    
    public Page<Package> getPackagesBySeller(String sellerId, Pageable pageable) {
        return packageRepository.findBySellerId(sellerId, pageable);
    }
    
    public Page<Package> getPackagesByStatus(PackageStatus status, Pageable pageable) {
        return packageRepository.findByStatus(status, pageable);
    }
    
    @Transactional
    public Package updatePackageStatus(String packageId, PackageStatus newStatus) {
        Package pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package", "id", packageId));
        
        validateStatusTransition(pkg.getStatus(), newStatus);
        
        pkg.setStatus(newStatus);
        Package updatedPackage = packageRepository.save(pkg);
        
        log.info("Package {} status updated from {} to {}", packageId, pkg.getStatus(), newStatus);
        return updatedPackage;
    }
    
    @Transactional
    public Package updateTrackingNumber(String packageId, String trackingNumber) {
        Package pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package", "id", packageId));
        
        if (pkg.getStatus() != PackageStatus.IN_STORAGE && pkg.getStatus() != PackageStatus.DISPATCHED) {
            throw new BusinessException("Tracking number can only be added to packages in IN_STORAGE or DISPATCHED status");
        }
        
        if (packageRepository.existsByTrackingNumber(trackingNumber)) {
            throw new BusinessException("Tracking number already exists");
        }
        
        pkg.setTrackingNumber(trackingNumber);
        if (pkg.getStatus() == PackageStatus.IN_STORAGE) {
            pkg.setStatus(PackageStatus.DISPATCHED);
        }
        
        Package updatedPackage = packageRepository.save(pkg);
        log.info("Tracking number {} added to package {}", trackingNumber, packageId);
        
        return updatedPackage;
    }
    
    @Transactional
    public void deletePackage(String packageId) {
        Package pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package", "id", packageId));
        
        if (pkg.getStatus() != PackageStatus.CREATED) {
            throw new BusinessException("Only packages with CREATED status can be deleted");
        }
        
        packageRepository.deleteById(packageId);
        log.info("Package {} deleted successfully", packageId);
    }
    
    private void validateStatusTransition(PackageStatus currentStatus, PackageStatus newStatus) {
        boolean isValid = switch (currentStatus) {
            case CREATED -> newStatus == PackageStatus.IN_STORAGE;
            case IN_STORAGE -> newStatus == PackageStatus.DISPATCHED;
            case DISPATCHED -> false;
        };
        
        if (!isValid) {
            throw new BusinessException(
                String.format("Invalid status transition from %s to %s", currentStatus, newStatus)
            );
        }
    }
}