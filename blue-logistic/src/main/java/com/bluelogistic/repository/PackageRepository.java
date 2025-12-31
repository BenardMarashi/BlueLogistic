package com.bluelogistic.repository;

import com.bluelogistic.entity.Package;
import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.enums.PackageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PackageRepository extends JpaRepository<Package, UUID> {

    @EntityGraph(attributePaths = {"seller"})
    Page<Package> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"seller"})
    Optional<Package> findById(UUID id);

    Optional<Package> findByTrackingNumber(String trackingNumber);
    
    Page<Package> findBySeller(Seller seller, Pageable pageable);
    
    @EntityGraph(attributePaths = {"seller"})
    Page<Package> findBySellerId(UUID sellerId, Pageable pageable);
    
    @EntityGraph(attributePaths = {"seller"})
    Page<Package> findByStatus(PackageStatus status, Pageable pageable);
    
    Page<Package> findBySellerAndStatus(Seller seller, PackageStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Package p JOIN FETCH p.seller WHERE p.id = :id")
    Optional<Package> findByIdWithSeller(@Param("id") UUID id);
    
    boolean existsByTrackingNumber(String trackingNumber);
    
    @EntityGraph(attributePaths = {"seller"})
    Page<Package> findBySellerIdAndStatus(UUID sellerId, PackageStatus status, Pageable pageable);

    @Query("SELECT p FROM Package p JOIN FETCH p.seller WHERE p.seller.id = :sellerId " +
           "AND LOWER(p.customerName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Package> findBySellerIdAndCustomerNameContaining(
        @Param("sellerId") UUID sellerId, 
        @Param("search") String search, 
        Pageable pageable);

    @Query("SELECT p FROM Package p JOIN FETCH p.seller WHERE " +
           "LOWER(p.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.trackingNumber) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Package> searchByCustomerNameOrTracking(@Param("search") String search, Pageable pageable);
}