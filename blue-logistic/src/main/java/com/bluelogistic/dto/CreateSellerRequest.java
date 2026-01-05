package com.bluelogistic.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(description = "Request to create a new seller account")
public record CreateSellerRequest(
    @Schema(description = "Full name of the seller", example = "John Smith", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Name is required")
    String name,

    @Schema(description = "Email address for the seller account", example = "john.smith@company.com", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    String email,

    @Schema(description = "Password for the seller account (minimum 8 characters)", example = "securePassword123", minLength = 8, requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    String password,

    @Schema(description = "Name of the seller's company", example = "ABC Electronics Ltd", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Company name is required")
    String companyName
) {}
