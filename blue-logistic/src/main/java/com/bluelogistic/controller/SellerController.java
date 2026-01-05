package com.bluelogistic.controller;

import com.bluelogistic.dto.*;
import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.Package;
import com.bluelogistic.entity.enums.PackageStatus;
import com.bluelogistic.mapper.SellerMapper;
import com.bluelogistic.mapper.PackageMapper;
import com.bluelogistic.service.SellerService;
import com.bluelogistic.service.PackageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/sellers")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Sellers", description = "Seller management operations (Admin only)")
@SecurityRequirement(name = "bearerAuth")
public class SellerController {

    private final SellerService sellerService;
    private final SellerMapper sellerMapper;
    private final PackageService packageService;
    private final PackageMapper packageMapper;

    @PostMapping
    @Operation(
        summary = "Create a new seller",
        description = "Creates a new seller account with associated user credentials. Only admins can create sellers."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Seller created successfully",
            content = @Content(schema = @Schema(implementation = SellerResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request body or email already exists",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Not authenticated",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Not authorized (admin only)",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
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
    @Operation(
        summary = "Get all sellers",
        description = "Returns a paginated list of all sellers. Only admins can view sellers."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved sellers"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Not authenticated",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Not authorized (admin only)",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    public ResponseEntity<Page<SellerResponse>> getSellers(Pageable pageable) {
        Page<Seller> sellers = sellerService.getAllSellers(pageable);
        return ResponseEntity.ok(sellers.map(sellerMapper::toResponse));
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get seller by ID",
        description = "Returns a specific seller by their ID. Only admins can view seller details."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved seller",
            content = @Content(schema = @Schema(implementation = SellerResponse.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Not authenticated",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Not authorized (admin only)",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Seller not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    public ResponseEntity<SellerResponse> getSeller(
            @Parameter(description = "Seller UUID", required = true)
            @PathVariable UUID id) {
        Seller seller = sellerService.getSellerById(id);
        return ResponseEntity.ok(sellerMapper.toResponse(seller));
    }

    @PatchMapping("/{id}/status")
    @Operation(
        summary = "Update seller status",
        description = "Activates or deactivates a seller account. Only admins can update seller status."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Status updated successfully",
            content = @Content(schema = @Schema(implementation = SellerResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request body",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Not authenticated",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Not authorized (admin only)",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Seller not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    public ResponseEntity<SellerResponse> updateStatus(
            @Parameter(description = "Seller UUID", required = true)
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSellerStatusRequest request) {
        Seller updatedSeller = sellerService.updateSellerStatus(id, request.isActive());
        return ResponseEntity.ok(sellerMapper.toResponse(updatedSeller));
    }

    @GetMapping("/{id}/packages")
    @Operation(
        summary = "Get seller's packages",
        description = "Returns a paginated list of packages belonging to a specific seller. Only admins can view this."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved packages"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Not authenticated",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Not authorized (admin only)",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Seller not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    public ResponseEntity<Page<PackageResponse>> getSellerPackages(
            @Parameter(description = "Seller UUID", required = true)
            @PathVariable UUID id,
            @Parameter(description = "Filter by package status")
            @RequestParam(required = false) PackageStatus status,
            @Parameter(description = "Search by tracking number, description, or customer name")
            @RequestParam(required = false) String search,
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "20")
            @RequestParam(defaultValue = "20") int size) {

        // Verify seller exists
        sellerService.getSellerById(id);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Package> packages = packageService.getPackagesBySellerFiltered(id, status, search, pageable);

        return ResponseEntity.ok(packages.map(packageMapper::toResponse));
    }
}
