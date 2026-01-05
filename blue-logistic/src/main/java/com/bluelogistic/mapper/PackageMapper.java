package com.bluelogistic.mapper;

import com.bluelogistic.dto.CreatePackageRequest;
import com.bluelogistic.dto.PackageResponse;
import com.bluelogistic.entity.Package;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class PackageMapper {
    
    public Package toEntity(CreatePackageRequest request) {
        Package pkg = new Package();
        pkg.setDescription(request.description());
        pkg.setWeight(request.weight());
        pkg.setCustomerName(request.customerName());
        pkg.setCustomerEmail(request.customerEmail());
        pkg.setCustomerPhone(request.customerPhone());
        pkg.setDeliveryAddress(request.deliveryAddress());
        pkg.setDestinationCountry(request.destinationCountry() != null
            ? request.destinationCountry().toUpperCase()
            : "AT");
        return pkg;
    }

    public PackageResponse toResponse(Package pkg) {
        return toResponse(pkg, false);
    }

    public PackageResponse toResponse(Package pkg, boolean isAdmin) {
        return new PackageResponse(
            pkg.getId(),
            pkg.getSeller().getId(),
            pkg.getSeller().getCompanyName(),
            pkg.getTrackingNumber(),
            pkg.getDescription(),
            pkg.getWeight(),
            pkg.getCustomerName(),
            pkg.getCustomerEmail(),
            pkg.getCustomerPhone(),
            pkg.getDeliveryAddress(),
            pkg.getStatus().name(),
            pkg.getCreatedAt(),
            pkg.getUpdatedAt(),
            pkg.getDestinationCountry(),
            isAdmin ? pkg.getCostPrice() : null,
            pkg.getSellerPrice(),
            isAdmin ? pkg.getPriceBreakdown() : null
        );
    }
}