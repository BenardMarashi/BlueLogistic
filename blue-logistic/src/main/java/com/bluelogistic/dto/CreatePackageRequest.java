package com.bluelogistic.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record CreatePackageRequest(
    @NotBlank(message = "Description is required")
    String description,
    
    @NotNull(message = "Weight is required")
    @DecimalMin(value = "0.01", message = "Weight must be greater than 0")
    BigDecimal weight,
    
    @NotBlank(message = "Customer name is required")
    String customerName,
    
    @NotBlank(message = "Customer email is required")
    @Email(message = "Customer email must be valid")
    String customerEmail,
    
    @NotBlank(message = "Customer phone is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone must be valid")
    String customerPhone,
    
    @NotBlank(message = "Delivery address is required")
    String deliveryAddress
) {}