package com.bluelogistic.service;

import com.bluelogistic.dto.PriceCalculationResult;
import com.bluelogistic.exception.BusinessException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class PricingService {

    // Weight brackets in kg
    private static final double[] WEIGHT_BRACKETS = {3.0, 5.0, 10.0, 15.0, 20.0, 25.0, 31.5};

    // Price matrix: country -> prices for each bracket
    private static final Map<String, double[]> PRICE_MATRIX = new HashMap<>();

    static {
        // Tier 1: Austria
        PRICE_MATRIX.put("AT", new double[]{2.90, 3.15, 3.55, 3.75, 4.20, 4.55, 4.95});

        // Tier 2: Germany
        PRICE_MATRIX.put("DE", new double[]{5.05, 7.00, 7.00, 7.00, 7.00, 7.00, 7.00});

        // Tier 3: Neighboring countries
        double[] tier3 = {6.00, 8.00, 8.00, 8.00, 8.00, 8.00, 8.00};
        PRICE_MATRIX.put("CZ", tier3);
        PRICE_MATRIX.put("HU", tier3);
        PRICE_MATRIX.put("SI", tier3);
        PRICE_MATRIX.put("SK", tier3);

        // Tier 4: Western/Central EU
        double[] tier4 = {8.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00};
        PRICE_MATRIX.put("BE", tier4);
        PRICE_MATRIX.put("DK", tier4);
        PRICE_MATRIX.put("FR", tier4);
        PRICE_MATRIX.put("HR", tier4);
        PRICE_MATRIX.put("IT", tier4);
        PRICE_MATRIX.put("LU", tier4);
        PRICE_MATRIX.put("NL", tier4);
        PRICE_MATRIX.put("PL", tier4);
        PRICE_MATRIX.put("CH", tier4);

        // Tier 5: Spain (variable pricing)
        PRICE_MATRIX.put("ES", new double[]{9.00, 12.00, 12.00, 15.00, 15.00, 20.00, 20.00});

        // Tier 6: Eastern/Northern EU + Balkans
        double[] tier6 = {10.00, 20.00, 20.00, 20.00, 20.00, 20.00, 20.00};
        PRICE_MATRIX.put("BG", tier6);
        PRICE_MATRIX.put("EE", tier6);
        PRICE_MATRIX.put("FI", tier6);
        PRICE_MATRIX.put("GR", tier6);
        PRICE_MATRIX.put("IE", tier6);
        PRICE_MATRIX.put("LT", tier6);
        PRICE_MATRIX.put("LV", tier6);
        PRICE_MATRIX.put("PT", tier6);
        PRICE_MATRIX.put("RO", tier6);
        PRICE_MATRIX.put("SE", tier6);
        PRICE_MATRIX.put("BA", tier6);
        PRICE_MATRIX.put("RS", tier6);

        // Tier 7: Iceland (premium)
        PRICE_MATRIX.put("IS", new double[]{45.53, 46.46, 48.03, 49.02, 49.93, 51.17, 52.40});
    }

    public PriceCalculationResult calculateOptimalPrice(String countryCode, Double weightKg) {
        if (countryCode == null || !PRICE_MATRIX.containsKey(countryCode.toUpperCase())) {
            throw new BusinessException("Unsupported country: " + countryCode);
        }
        if (weightKg == null || weightKg <= 0) {
            throw new BusinessException("Weight must be greater than 0");
        }

        String country = countryCode.toUpperCase();

        // Single package - no split needed
        if (weightKg <= 31.5) {
            BigDecimal price = getPriceForWeight(country, weightKg);
            String breakdown = formatWeight(weightKg);
            return PriceCalculationResult.of(price, breakdown);
        }

        // Need to split - find optimal combination
        return findOptimalSplit(country, weightKg);
    }

    private BigDecimal getPriceForWeight(String country, double weight) {
        double[] prices = PRICE_MATRIX.get(country);

        for (int i = 0; i < WEIGHT_BRACKETS.length; i++) {
            if (weight <= WEIGHT_BRACKETS[i]) {
                return BigDecimal.valueOf(prices[i]).setScale(2, RoundingMode.HALF_UP);
            }
        }

        // If weight > 31.5, return max bracket price
        return BigDecimal.valueOf(prices[prices.length - 1]).setScale(2, RoundingMode.HALF_UP);
    }

    private PriceCalculationResult findOptimalSplit(String country, double totalWeight) {
        // Try different splitting strategies and pick the cheapest
        List<SplitResult> candidates = new ArrayList<>();

        // Strategy 1: Greedy with max packages (31.5kg)
        candidates.add(trySplit(country, totalWeight, 31.5));

        // Strategy 2: Use 25kg packages
        candidates.add(trySplit(country, totalWeight, 25.0));

        // Strategy 3: Use 20kg packages
        candidates.add(trySplit(country, totalWeight, 20.0));

        // Strategy 4: Use 15kg packages
        candidates.add(trySplit(country, totalWeight, 15.0));

        // Strategy 5: Use 10kg packages
        candidates.add(trySplit(country, totalWeight, 10.0));

        // Strategy 6: Mixed - try combinations
        candidates.add(tryMixedSplit(country, totalWeight));

        // Find minimum cost
        SplitResult best = candidates.stream()
            .filter(Objects::nonNull)
            .min(Comparator.comparing(s -> s.totalCost))
            .orElseThrow(() -> new BusinessException("Could not calculate price"));

        return PriceCalculationResult.of(best.totalCost, best.breakdown);
    }

    private SplitResult trySplit(String country, double totalWeight, double packageSize) {
        int fullPackages = (int) (totalWeight / packageSize);
        double remainder = totalWeight - (fullPackages * packageSize);

        // Round remainder to avoid floating point issues
        remainder = Math.round(remainder * 100.0) / 100.0;

        BigDecimal totalCost = BigDecimal.ZERO;
        List<String> parts = new ArrayList<>();

        if (fullPackages > 0) {
            BigDecimal packagePrice = getPriceForWeight(country, packageSize);
            totalCost = totalCost.add(packagePrice.multiply(BigDecimal.valueOf(fullPackages)));
            parts.add(fullPackages + "×" + formatWeight(packageSize));
        }

        if (remainder > 0.01) {
            BigDecimal remainderPrice = getPriceForWeight(country, remainder);
            totalCost = totalCost.add(remainderPrice);
            parts.add("1×" + formatWeight(remainder));
        }

        String breakdown = String.join(" + ", parts);
        return new SplitResult(totalCost, breakdown);
    }

    private SplitResult tryMixedSplit(String country, double totalWeight) {
        // Try optimal mix of different package sizes
        SplitResult best = null;

        // Try combinations of 31.5 + 25, 31.5 + 20, etc.
        for (int num31 = 0; num31 <= (int)(totalWeight / 31.5) + 1; num31++) {
            double remaining = totalWeight - (num31 * 31.5);
            if (remaining < 0) continue;

            for (int num25 = 0; num25 <= (int)(remaining / 25.0) + 1; num25++) {
                double remaining2 = remaining - (num25 * 25.0);
                if (remaining2 < 0) continue;

                for (int num20 = 0; num20 <= (int)(remaining2 / 20.0) + 1; num20++) {
                    double remaining3 = remaining2 - (num20 * 20.0);
                    if (remaining3 < 0) continue;

                    // Remaining goes into smallest appropriate package
                    remaining3 = Math.round(remaining3 * 100.0) / 100.0;

                    if (remaining3 > 31.5) continue; // Invalid split

                    BigDecimal cost = BigDecimal.ZERO;
                    List<String> parts = new ArrayList<>();

                    if (num31 > 0) {
                        cost = cost.add(getPriceForWeight(country, 31.5).multiply(BigDecimal.valueOf(num31)));
                        parts.add(num31 + "×31.5kg");
                    }
                    if (num25 > 0) {
                        cost = cost.add(getPriceForWeight(country, 25.0).multiply(BigDecimal.valueOf(num25)));
                        parts.add(num25 + "×25kg");
                    }
                    if (num20 > 0) {
                        cost = cost.add(getPriceForWeight(country, 20.0).multiply(BigDecimal.valueOf(num20)));
                        parts.add(num20 + "×20kg");
                    }
                    if (remaining3 > 0.01) {
                        cost = cost.add(getPriceForWeight(country, remaining3));
                        parts.add("1×" + formatWeight(remaining3));
                    }

                    if (parts.isEmpty()) continue;

                    String breakdown = String.join(" + ", parts);

                    if (best == null || cost.compareTo(best.totalCost) < 0) {
                        best = new SplitResult(cost, breakdown);
                    }
                }
            }
        }

        return best;
    }

    private String formatWeight(double weight) {
        if (weight == Math.floor(weight)) {
            return (int) weight + "kg";
        }
        return String.format("%.1fkg", weight).replace(",", ".");
    }

    public boolean isCountrySupported(String countryCode) {
        return countryCode != null && PRICE_MATRIX.containsKey(countryCode.toUpperCase());
    }

    public Set<String> getSupportedCountries() {
        return PRICE_MATRIX.keySet();
    }

    private record SplitResult(BigDecimal totalCost, String breakdown) {}
}
