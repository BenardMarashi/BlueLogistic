package com.bluelogistic.controller;

import com.bluelogistic.dto.*;
import com.bluelogistic.entity.Package;
import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.User;
import com.bluelogistic.entity.enums.Role;
import com.bluelogistic.entity.enums.PackageStatus;
import com.bluelogistic.mapper.PackageMapper;
import com.bluelogistic.service.PackageService;
import com.bluelogistic.service.SellerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class PackageController {
    
    private final PackageService packageService;
    private final SellerService sellerService;
    private final PackageMapper packageMapper;
    
    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<PackageResponse> createPackage(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreatePackageRequest request) {
        Seller seller = sellerService.getSellerByUserId(user.getId());
        Package pkg = packageMapper.toEntity(request);
        Package createdPackage = packageService.createPackage(seller.getId(), pkg);
        return ResponseEntity.status(HttpStatus.CREATED).body(packageMapper.toResponse(createdPackage));
    }
    
    @GetMapping
    public ResponseEntity<Page<PackageResponse>> getPackages(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) PackageStatus status,
            @RequestParam(required = false) UUID sellerId,
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
    
    @GetMapping("/{id}")
    public ResponseEntity<PackageResponse> getPackage(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        Package pkg = packageService.getPackageById(id);
        
        if (user.getRole() == Role.SELLER) {
            Seller seller = sellerService.getSellerByUserId(user.getId());
            if (!pkg.getSeller().getId().equals(seller.getId())) {
                return ResponseEntity.notFound().build();
            }
        }
        
        return ResponseEntity.ok(packageMapper.toResponse(pkg));
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PackageResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStatusRequest request) {
        Package updatedPackage = packageService.updatePackageStatus(id, request.status());
        return ResponseEntity.ok(packageMapper.toResponse(updatedPackage));
    }
    
    @PatchMapping("/{id}/tracking")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PackageResponse> updateTracking(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTrackingRequest request) {
        Package updatedPackage = packageService.updateTrackingNumber(id, request.trackingNumber());
        return ResponseEntity.ok(packageMapper.toResponse(updatedPackage));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePackage(@PathVariable UUID id) {
        packageService.deletePackage(id);
        return ResponseEntity.noContent().build();
    }
}