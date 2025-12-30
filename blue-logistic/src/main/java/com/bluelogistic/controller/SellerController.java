package com.bluelogistic.controller;

import com.bluelogistic.dto.*;
import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.Package;
import com.bluelogistic.entity.enums.PackageStatus;
import com.bluelogistic.mapper.SellerMapper;
import com.bluelogistic.mapper.PackageMapper;
import com.bluelogistic.service.SellerService;
import com.bluelogistic.service.PackageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/sellers")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class SellerController {
    
    private final SellerService sellerService;
    private final SellerMapper sellerMapper;
    private final PackageService packageService;
    private final PackageMapper packageMapper;
    
    @PostMapping
    public ResponseEntity<SellerResponse> createSeller(@Valid @RequestBody CreateSellerRequest request) {
        Seller seller = sellerService.createSeller(
            request.name(),
            request.email(),
            request.password(),
            request.companyName()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(sellerMapper.toResponse(seller));
    }
    
    @GetMapping
    public ResponseEntity<Page<SellerResponse>> getSellers(Pageable pageable) {
        Page<Seller> sellers = sellerService.getAllSellers(pageable);
        return ResponseEntity.ok(sellers.map(sellerMapper::toResponse));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SellerResponse> getSeller(@PathVariable UUID id) {
        Seller seller = sellerService.getSellerById(id);
        return ResponseEntity.ok(sellerMapper.toResponse(seller));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<SellerResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSellerStatusRequest request) {
        Seller updatedSeller = sellerService.updateSellerStatus(id, request.isActive());
        return ResponseEntity.ok(sellerMapper.toResponse(updatedSeller));
    }
    
    @GetMapping("/{id}/packages")
    public ResponseEntity<Page<PackageResponse>> getSellerPackages(
            @PathVariable UUID id,
            @RequestParam(required = false) PackageStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        // Verify seller exists
        sellerService.getSellerById(id);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Package> packages = packageService.getPackagesBySellerFiltered(id, status, search, pageable);
        
        return ResponseEntity.ok(packages.map(packageMapper::toResponse));
    }
}