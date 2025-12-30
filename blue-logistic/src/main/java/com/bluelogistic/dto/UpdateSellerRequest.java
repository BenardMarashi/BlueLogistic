package com.bluelogistic.dto;

import jakarta.validation.constraints.Size;

public record UpdateSellerRequest(
    @Size(min = 2, max = 100, message = "Company name must be 2-100 characters")
    String companyName,
    
    Boolean isActive
) {}