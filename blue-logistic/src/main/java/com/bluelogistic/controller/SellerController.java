package com.bluelogistic.controller;

import com.bluelogistic.dto.*;
import com.bluelogistic.entity.Seller;
import com.bluelogistic.mapper.SellerMapper;
import com.bluelogistic.service.SellerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sellers")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class SellerController {
    
    private final SellerService sellerService;
    private final SellerMapper sellerMapper;
    
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
    public ResponseEntity<SellerResponse> getSeller(@PathVariable String id) {
        Seller seller = sellerService.getSellerById(id);
        return ResponseEntity.ok(sellerMapper.toResponse(seller));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<SellerResponse> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateSellerStatusRequest request) {
        Seller updatedSeller = sellerService.updateSellerStatus(id, request.isActive());
        return ResponseEntity.ok(sellerMapper.toResponse(updatedSeller));
    }
}