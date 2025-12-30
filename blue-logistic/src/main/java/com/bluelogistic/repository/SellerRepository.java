package com.bluelogistic.repository;

import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SellerRepository extends JpaRepository<Seller, UUID> {
    
    Optional<Seller> findByUser(User user);
    
    Optional<Seller> findByUserId(UUID userId);
    
    List<Seller> findByIsActive(boolean isActive);
    
    @Query("SELECT s FROM Seller s JOIN FETCH s.user WHERE s.id = :id")
    Optional<Seller> findByIdWithUser(@Param("id") UUID id);
}