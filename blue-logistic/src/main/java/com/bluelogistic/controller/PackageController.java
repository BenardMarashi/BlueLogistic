package com.bluelogistic.controller;

import com.bluelogistic.dto.*;
import com.bluelogistic.entity.Package;
import com.bluelogistic.entity.Seller;
import com.bluelogistic.entity.User;
import com.bluelogistic.entity.enums.Role;
import com.bluelogistic.entity.enums.PackageStatus;
import com.bluelogistic.mapper.PackageMapper;
import com.bluelogistic.service.PackageService;
import com.bluelogistic.service.SellerService;
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
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
@Tag(name = "Packages", description = "Package management operations")
@SecurityRequirement(name = "bearerAuth")
public class PackageController {

    private final PackageService packageService;
    private final SellerService sellerService;
    private final PackageMapper packageMapper;

    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    @Operation(
        summary = "Create a new package",
        description = "Creates a new package for the authenticated seller. Only users with SELLER role can create packages."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Package created successfully",
            content = @Content(schema = @Schema(implementation = PackageResponse.class))
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
            description = "User is not a seller",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    public ResponseEntity<PackageResponse> createPackage(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreatePackageRequest request) {
        Seller seller = sellerService.getSellerByUserId(user.getId());
        Package pkg = packageMapper.toEntity(request);
        Package createdPackage = packageService.createPackage(seller.getId(), pkg);
        boolean isAdmin = user.getRole() == Role.ADMIN;
        return ResponseEntity.status(HttpStatus.CREATED).body(packageMapper.toResponse(createdPackage, isAdmin));
    }

    @GetMapping
    @Operation(
        summary = "Get all packages",
        description = "Returns a paginated list of packages. Admins see all packages, sellers see only their own packages."
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
        )
    })
    public ResponseEntity<Page<PackageResponse>> getPackages(
            @AuthenticationPrincipal User user,
            @Parameter(description = "Filter by package status")
            @RequestParam(required = false) PackageStatus status,
            @Parameter(description = "Filter by seller ID (admin only)")
            @RequestParam(required = false) UUID sellerId,
            @Parameter(description = "Search by tracking number, description, or customer name")
            @RequestParam(required = false) String search,
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "20")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field", example = "createdAt")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)", example = "desc")
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Package> packages;

        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (user.getRole() == Role.SELLER) {
            Seller seller = sellerService.getSellerByUserId(user.getId());
            packages = packageService.getPackagesBySellerFiltered(seller.getId(), status, search, pageable);
        } else {
            packages = packageService.getPackagesFiltered(status, sellerId, search, pageable);
        }

        return ResponseEntity.ok(packages.map(p -> packageMapper.toResponse(p, isAdmin)));
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get package by ID",
        description = "Returns a specific package by its ID. Sellers can only view their own packages."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved package",
            content = @Content(schema = @Schema(implementation = PackageResponse.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Not authenticated",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Package not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    public ResponseEntity<PackageResponse> getPackage(
            @AuthenticationPrincipal User user,
            @Parameter(description = "Package UUID", required = true)
            @PathVariable UUID id) {
        Package pkg = packageService.getPackageById(id);

        if (user.getRole() == Role.SELLER) {
            Seller seller = sellerService.getSellerByUserId(user.getId());
            if (!pkg.getSeller().getId().equals(seller.getId())) {
                return ResponseEntity.notFound().build();
            }
        }

        boolean isAdmin = user.getRole() == Role.ADMIN;
        return ResponseEntity.ok(packageMapper.toResponse(pkg, isAdmin));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Update package status",
        description = "Updates the status of a package. Only admins can update status. Status transitions: CREATED → IN_STORAGE → DISPATCHED"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Status updated successfully",
            content = @Content(schema = @Schema(implementation = PackageResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid status transition",
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
            description = "Package not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    public ResponseEntity<PackageResponse> updateStatus(
            @Parameter(description = "Package UUID", required = true)
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStatusRequest request) {
        Package updatedPackage = packageService.updatePackageStatus(id, request.status());
        return ResponseEntity.ok(packageMapper.toResponse(updatedPackage, true));
    }

    @PatchMapping("/{id}/tracking")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Update tracking number",
        description = "Updates the tracking number of a package. Only admins can update tracking numbers."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Tracking number updated successfully",
            content = @Content(schema = @Schema(implementation = PackageResponse.class))
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
            description = "Package not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    public ResponseEntity<PackageResponse> updateTracking(
            @Parameter(description = "Package UUID", required = true)
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTrackingRequest request) {
        Package updatedPackage = packageService.updateTrackingNumber(id, request.trackingNumber());
        return ResponseEntity.ok(packageMapper.toResponse(updatedPackage, true));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Delete package",
        description = "Deletes a package by its ID. Only admins can delete packages."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "204",
            description = "Package deleted successfully"
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
            description = "Package not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    public ResponseEntity<Void> deletePackage(
            @Parameter(description = "Package UUID", required = true)
            @PathVariable UUID id) {
        packageService.deletePackage(id);
        return ResponseEntity.noContent().build();
    }
}
