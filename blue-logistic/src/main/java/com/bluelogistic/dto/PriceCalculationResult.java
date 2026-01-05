package com.bluelogistic.dto;

import java.math.BigDecimal;

public record PriceCalculationResult(
    BigDecimal costPrice,
    BigDecimal sellerPrice,
    String breakdown
) {
    public static PriceCalculationResult of(BigDecimal costPrice, String breakdown) {
        BigDecimal sellerPrice = costPrice.multiply(BigDecimal.valueOf(2));
        return new PriceCalculationResult(costPrice, sellerPrice, breakdown);
    }
}
