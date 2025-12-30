package com.bluelogistic.repository;

import com.bluelogistic.entity.Package;
import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.enums.PackageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PackageRepository extends JpaRepository<Package, String> {
    
    Optional<Package> findByTrackingNumber(String trackingNumber);
    
    Page<Package> findBySeller(Seller seller, Pageable pageable);
    
    Page<Package> findBySellerId(String sellerId, Pageable pageable);
    
    Page<Package> findByStatus(PackageStatus status, Pageable pageable);
    
    Page<Package> findBySellerAndStatus(Seller seller, PackageStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Package p JOIN FETCH p.seller WHERE p.id = :id")
    Optional<Package> findByIdWithSeller(@Param("id") String id);
    
    boolean existsByTrackingNumber(String trackingNumber);
    
    Page<Package> findBySellerIdAndStatus(String sellerId, PackageStatus status, Pageable pageable);

    @Query("SELECT p FROM Package p WHERE p.seller.id = :sellerId " +
           "AND LOWER(p.customerName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Package> findBySellerIdAndCustomerNameContaining(
        @Param("sellerId") String sellerId, 
        @Param("search") String search, 
        Pageable pageable);

    @Query("SELECT p FROM Package p WHERE " +
           "LOWER(p.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.trackingNumber) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Package> searchByCustomerNameOrTracking(@Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Package p JOIN FETCH p.seller WHERE p.seller.id = :sellerId")
    Page<Package> findBySellerIdWithSeller(@Param("sellerId") String sellerId, Pageable pageable);
}