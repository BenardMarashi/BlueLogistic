package com.bluelogistic.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Schema(description = "Request to create a new package")
public record CreatePackageRequest(
    @Schema(description = "Description of the package contents", example = "Electronics - Laptop", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Description is required")
    String description,

    @Schema(description = "Weight of the package in kilograms", example = "2.5", minimum = "0.01", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Weight is required")
    @DecimalMin(value = "0.01", message = "Weight must be greater than 0")
    BigDecimal weight,

    @Schema(description = "Name of the customer receiving the package", example = "John Doe", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Customer name is required")
    String customerName,

    @Schema(description = "Email address of the customer", example = "john.doe@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Customer email is required")
    @Email(message = "Customer email must be valid")
    String customerEmail,

    @Schema(description = "Phone number of the customer (10-15 digits, optionally starting with +)", example = "+1234567890", pattern = "^\\+?[0-9]{10,15}$", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Customer phone is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone must be valid")
    String customerPhone,

    @Schema(description = "Full delivery address", example = "123 Main Street, Apt 4B, New York, NY 10001", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Delivery address is required")
    String deliveryAddress,

    @Schema(description = "Destination country ISO code", example = "AT", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Destination country is required")
    @Size(min = 2, max = 2, message = "Country code must be 2 characters")
    String destinationCountry
) {}
