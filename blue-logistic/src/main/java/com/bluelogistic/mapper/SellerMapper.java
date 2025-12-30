package com.bluelogistic.mapper;

import com.bluelogistic.dto.SellerResponse;
import com.bluelogistic.entity.Seller;
import org.springframework.stereotype.Component;

@Component
public class SellerMapper {
    
    public SellerResponse toResponse(Seller seller) {
        return new SellerResponse(
            seller.getId(),
            seller.getUser().getId(),
            seller.getUser().getName(),
            seller.getUser().getEmail(),
            seller.getCompanyName(),
            seller.isActive(),
            seller.getCreatedAt(),
            seller.getUpdatedAt()
        );
    }
}