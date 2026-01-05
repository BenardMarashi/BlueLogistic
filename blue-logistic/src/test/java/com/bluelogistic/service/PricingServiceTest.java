package com.bluelogistic.service;

import com.bluelogistic.dto.PriceCalculationResult;
import com.bluelogistic.exception.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PricingServiceTest {

    private PricingService pricingService;

    @BeforeEach
    void setUp() {
        pricingService = new PricingService();
    }

    @Test
    void calculateOptimalPrice_Austria5kg_ReturnsCorrectPrice() {
        // Test 1: Simple Package (No Split)
        PriceCalculationResult result = pricingService.calculateOptimalPrice("AT", 5.0);

        assertThat(result.costPrice()).isEqualTo(new BigDecimal("3.15"));
        assertThat(result.sellerPrice()).isEqualTo(new BigDecimal("6.30"));
        assertThat(result.breakdown()).isEqualTo("5kg");
    }

    @Test
    void calculateOptimalPrice_Austria31_5kg_ReturnsCorrectPrice() {
        // Test 2: Max Single Package
        PriceCalculationResult result = pricingService.calculateOptimalPrice("AT", 31.5);

        assertThat(result.costPrice()).isEqualTo(new BigDecimal("4.95"));
        assertThat(result.sellerPrice()).isEqualTo(new BigDecimal("9.90"));
        assertThat(result.breakdown()).isEqualTo("31.5kg");
    }

    @Test
    void calculateOptimalPrice_Germany40kg_ReturnsOptimalSplit() {
        // Test 4: Oversized Package - Germany
        // For DE: ≤3kg=€5.05, ≤5kg+=€7.00
        // 40kg split: 31.5kg (€7.00) + 8.5kg (€7.00) = €14.00
        // OR: 2×20kg = 2×€7.00 = €14.00 (same cost)
        PriceCalculationResult result = pricingService.calculateOptimalPrice("DE", 40.0);

        assertThat(result.costPrice()).isEqualTo(new BigDecimal("14.00"));
        assertThat(result.sellerPrice()).isEqualTo(new BigDecimal("28.00"));
    }

    @Test
    void calculateOptimalPrice_Austria10kg_ReturnsCorrectPrice() {
        // Test 8: Different Country Tier - AT (Tier 1)
        PriceCalculationResult result = pricingService.calculateOptimalPrice("AT", 10.0);

        assertThat(result.costPrice()).isEqualTo(new BigDecimal("3.55"));
    }

    @Test
    void calculateOptimalPrice_Germany10kg_ReturnsCorrectPrice() {
        // Test 8: Different Country Tier - DE (Tier 2)
        PriceCalculationResult result = pricingService.calculateOptimalPrice("DE", 10.0);

        assertThat(result.costPrice()).isEqualTo(new BigDecimal("7.00"));
    }

    @Test
    void calculateOptimalPrice_Czechia10kg_ReturnsCorrectPrice() {
        // Test 8: Different Country Tier - CZ (Tier 3)
        PriceCalculationResult result = pricingService.calculateOptimalPrice("CZ", 10.0);

        assertThat(result.costPrice()).isEqualTo(new BigDecimal("8.00"));
    }

    @Test
    void calculateOptimalPrice_France10kg_ReturnsCorrectPrice() {
        // Test 8: Different Country Tier - FR (Tier 4)
        PriceCalculationResult result = pricingService.calculateOptimalPrice("FR", 10.0);

        assertThat(result.costPrice()).isEqualTo(new BigDecimal("10.00"));
    }

    @Test
    void calculateOptimalPrice_Spain10kg_ReturnsCorrectPrice() {
        // Test 8: Different Country Tier - ES (Tier 5)
        PriceCalculationResult result = pricingService.calculateOptimalPrice("ES", 10.0);

        assertThat(result.costPrice()).isEqualTo(new BigDecimal("12.00"));
    }

    @Test
    void calculateOptimalPrice_Bulgaria10kg_ReturnsCorrectPrice() {
        // Test 8: Different Country Tier - BG (Tier 6)
        PriceCalculationResult result = pricingService.calculateOptimalPrice("BG", 10.0);

        assertThat(result.costPrice()).isEqualTo(new BigDecimal("20.00"));
    }

    @Test
    void calculateOptimalPrice_Iceland10kg_ReturnsCorrectPrice() {
        // Test 8: Different Country Tier - IS (Tier 7)
        PriceCalculationResult result = pricingService.calculateOptimalPrice("IS", 10.0);

        assertThat(result.costPrice()).isEqualTo(new BigDecimal("48.03"));
    }

    @Test
    void calculateOptimalPrice_UnsupportedCountry_ThrowsBusinessException() {
        // Test 7: Validation - Invalid country
        assertThatThrownBy(() -> pricingService.calculateOptimalPrice("XX", 10.0))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Unsupported country");
    }

    @Test
    void calculateOptimalPrice_ZeroWeight_ThrowsBusinessException() {
        // Test 7: Validation - Weight <= 0
        assertThatThrownBy(() -> pricingService.calculateOptimalPrice("AT", 0.0))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Weight must be greater than 0");
    }

    @Test
    void calculateOptimalPrice_NegativeWeight_ThrowsBusinessException() {
        // Test 7: Validation - Negative weight
        assertThatThrownBy(() -> pricingService.calculateOptimalPrice("AT", -5.0))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Weight must be greater than 0");
    }

    @Test
    void calculateOptimalPrice_LowercaseCountry_Works() {
        // Case insensitive country codes
        PriceCalculationResult result = pricingService.calculateOptimalPrice("at", 5.0);

        assertThat(result.costPrice()).isEqualTo(new BigDecimal("3.15"));
    }

    @Test
    void isCountrySupported_ValidCountry_ReturnsTrue() {
        assertThat(pricingService.isCountrySupported("AT")).isTrue();
        assertThat(pricingService.isCountrySupported("DE")).isTrue();
        assertThat(pricingService.isCountrySupported("IS")).isTrue();
    }

    @Test
    void isCountrySupported_InvalidCountry_ReturnsFalse() {
        assertThat(pricingService.isCountrySupported("XX")).isFalse();
        assertThat(pricingService.isCountrySupported(null)).isFalse();
    }

    @Test
    void getSupportedCountries_ReturnsAllCountries() {
        assertThat(pricingService.getSupportedCountries()).hasSize(29);
        assertThat(pricingService.getSupportedCountries()).contains("AT", "DE", "FR", "IS");
    }
}
