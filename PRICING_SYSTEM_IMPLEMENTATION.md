# BlueLogistic - Smart Pricing System Implementation

## Overview

This document contains complete instructions to add automatic price calculation to BlueLogistic based on package weight and destination country, with intelligent weight splitting for packages over 31.5kg.

**CRITICAL RULES:**
- Do NOT delete or modify any existing functionality
- Do NOT change any existing endpoint behavior, authentication, or features
- Only ADD the pricing feature as described below
- Test thoroughly before considering complete

---

## Pricing Logic

### Weight Brackets
| Bracket | Max Weight |
|---------|------------|
| 1 | 3.00 kg |
| 2 | 5.00 kg |
| 3 | 10.00 kg |
| 4 | 15.00 kg |
| 5 | 20.00 kg |
| 6 | 25.00 kg |
| 7 | 31.50 kg |

### Smart Weight Splitting

**Single package (≤31.5kg):** Calculate price directly from matrix.

**Oversized package (>31.5kg):** DO NOT REJECT. Instead, find the optimal split into multiple "virtual packages" that gives the LOWEST total cost.

#### Example 1: 40kg to Austria (AT)
```
Option A: 31.5kg (€4.95) + 8.5kg (€3.55) = €8.50
Option B: 20kg (€4.20) + 20kg (€4.20) = €8.40 ← WINNER
Option C: 25kg (€4.55) + 15kg (€3.75) = €8.30 ← EVEN BETTER

System picks cheapest: 25kg + 15kg = €8.30
Breakdown: "1×25kg + 1×15kg"
```

#### Example 2: 65kg to Germany (DE)
```
Option A: 31.5kg (€7.00) + 31.5kg (€7.00) + 2kg (€5.05) = €19.05
Option B: 31.5kg (€7.00) + 25kg (€7.00) + 8.5kg (€7.00) = €21.00
Option C: 20kg (€7.00) + 20kg (€7.00) + 20kg (€7.00) + 5kg (€7.00) = €28.00

System picks cheapest: Option A = €19.05
Breakdown: "2×31.5kg + 1×2kg"
```

#### Example 3: 100kg to Austria (AT)
```
Find optimal combination of packages summing to 100kg with minimum cost.
Could be: 4×25kg = 4×€4.55 = €18.20
Or: 3×31.5kg + 1×5.5kg = 3×€4.95 + €3.15 = €18.00 ← CHEAPER
Breakdown: "3×31.5kg + 1×5.5kg"
```

### Price Visibility Rules

| Role | Sees Cost Price | Sees Seller Price | Sees Breakdown |
|------|-----------------|-------------------|----------------|
| ADMIN | ✅ Yes | ✅ Yes | ✅ Yes |
| SELLER | ❌ No (null) | ✅ Yes | ❌ No (null) |

**Seller Price = Cost Price × 2** (100% markup = 50% margin)

---

## Price Matrix (EUR) - Cost Prices

### Tier 1: Austria (Domestic)
| Country | ≤3kg | ≤5kg | ≤10kg | ≤15kg | ≤20kg | ≤25kg | ≤31.5kg |
|---------|------|------|-------|-------|-------|-------|---------|
| AT | 2.90 | 3.15 | 3.55 | 3.75 | 4.20 | 4.55 | 4.95 |

### Tier 2: Germany
| Country | ≤3kg | ≤5kg | ≤10kg | ≤15kg | ≤20kg | ≤25kg | ≤31.5kg |
|---------|------|------|-------|-------|-------|-------|---------|
| DE | 5.05 | 7.00 | 7.00 | 7.00 | 7.00 | 7.00 | 7.00 |

### Tier 3: Neighboring Countries
| Countries | ≤3kg | ≤5kg | ≤10kg | ≤15kg | ≤20kg | ≤25kg | ≤31.5kg |
|-----------|------|------|-------|-------|-------|-------|---------|
| CZ, HU, SI, SK | 6.00 | 8.00 | 8.00 | 8.00 | 8.00 | 8.00 | 8.00 |

### Tier 4: Western/Central EU
| Countries | ≤3kg | ≤5kg | ≤10kg | ≤15kg | ≤20kg | ≤25kg | ≤31.5kg |
|-----------|------|------|-------|-------|-------|-------|---------|
| BE, DK, FR, HR, IT, LU, NL, PL, CH | 8.00 | 10.00 | 10.00 | 10.00 | 10.00 | 10.00 | 10.00 |

### Tier 5: Spain (Variable)
| Country | ≤3kg | ≤5kg | ≤10kg | ≤15kg | ≤20kg | ≤25kg | ≤31.5kg |
|---------|------|------|-------|-------|-------|-------|---------|
| ES | 9.00 | 12.00 | 12.00 | 15.00 | 15.00 | 20.00 | 20.00 |

### Tier 6: Eastern/Northern EU + Balkans
| Countries | ≤3kg | ≤5kg | ≤10kg | ≤15kg | ≤20kg | ≤25kg | ≤31.5kg |
|-----------|------|------|-------|-------|-------|-------|---------|
| BG, EE, FI, GR, IE, LT, LV, PT, RO, SE, BA, RS | 10.00 | 20.00 | 20.00 | 20.00 | 20.00 | 20.00 | 20.00 |

### Tier 7: Iceland (Premium)
| Country | ≤3kg | ≤5kg | ≤10kg | ≤15kg | ≤20kg | ≤25kg | ≤31.5kg |
|---------|------|------|-------|-------|-------|-------|---------|
| IS | 45.53 | 46.46 | 48.03 | 49.02 | 49.93 | 51.17 | 52.40 |

---

## Supported Countries Reference

```
AT = Austria
BA = Bosnia and Herzegovina
BE = Belgium
BG = Bulgaria
CH = Switzerland
CZ = Czechia
DE = Germany
DK = Denmark
EE = Estonia
ES = Spain
FI = Finland
FR = France
GR = Greece
HR = Croatia
HU = Hungary
IE = Ireland
IS = Iceland
IT = Italy
LT = Lithuania
LU = Luxembourg
LV = Latvia
NL = Netherlands
PL = Poland
PT = Portugal
RO = Romania
RS = Serbia
SE = Sweden
SI = Slovenia
SK = Slovakia
```

---

## Backend Implementation

### Task 1: Database Migration

**Create file:** `src/main/resources/db/migration/V5__add_pricing_fields.sql`

```sql
-- Add pricing-related columns to packages table
ALTER TABLE packages ADD COLUMN destination_country VARCHAR(2) NOT NULL DEFAULT 'AT';
ALTER TABLE packages ADD COLUMN cost_price DECIMAL(10,2);
ALTER TABLE packages ADD COLUMN seller_price DECIMAL(10,2);
ALTER TABLE packages ADD COLUMN price_breakdown VARCHAR(255);

-- Add index for country-based queries
CREATE INDEX idx_packages_destination_country ON packages(destination_country);
```

### Task 2: Update Package Entity

**File:** `src/main/java/com/bluelogistic/entity/Package.java`

Add these fields:

```java
@Column(name = "destination_country", nullable = false, length = 2)
private String destinationCountry = "AT";

@Column(name = "cost_price", precision = 10, scale = 2)
private BigDecimal costPrice;

@Column(name = "seller_price", precision = 10, scale = 2)
private BigDecimal sellerPrice;

@Column(name = "price_breakdown")
private String priceBreakdown;
```

Add getters and setters for all new fields.

### Task 3: Create Price Calculation Result Class

**Create file:** `src/main/java/com/bluelogistic/dto/PriceCalculationResult.java`

```java
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
```

### Task 4: Create PricingService

**Create file:** `src/main/java/com/bluelogistic/service/PricingService.java`

```java
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
```

### Task 5: Update CreatePackageRequest DTO

**File:** `src/main/java/com/bluelogistic/dto/CreatePackageRequest.java`

Add this field:

```java
@NotBlank(message = "Destination country is required")
@Size(min = 2, max = 2, message = "Country code must be 2 characters")
@Schema(description = "Destination country ISO code", example = "AT")
String destinationCountry
```

### Task 6: Update PackageResponse DTO

**File:** `src/main/java/com/bluelogistic/dto/PackageResponse.java`

Add these fields:

```java
@Schema(description = "Destination country ISO code", example = "AT")
String destinationCountry,

@Schema(description = "Cost price in EUR (admin only)", example = "8.30")
BigDecimal costPrice,

@Schema(description = "Seller price in EUR (cost × 2)", example = "16.60")
BigDecimal sellerPrice,

@Schema(description = "Price calculation breakdown (admin only)", example = "1×25kg + 1×15kg")
String priceBreakdown
```

### Task 7: Update PackageMapper

**File:** `src/main/java/com/bluelogistic/mapper/PackageMapper.java`

Update toEntity method to map destinationCountry from request.

Update toResponse method to include new fields. Add a parameter for user role or create two methods:

```java
public PackageResponse toResponse(Package entity) {
    return toResponse(entity, false);
}

public PackageResponse toResponse(Package entity, boolean isAdmin) {
    return new PackageResponse(
        entity.getId(),
        // ... existing fields ...
        entity.getDestinationCountry(),
        isAdmin ? entity.getCostPrice() : null,
        entity.getSellerPrice(),
        isAdmin ? entity.getPriceBreakdown() : null
    );
}
```

### Task 8: Update PackageService

**File:** `src/main/java/com/bluelogistic/service/PackageService.java`

Inject PricingService and update createPackage method:

```java
@Autowired
private PricingService pricingService;

// In createPackage method, after creating entity and before save:
PriceCalculationResult priceResult = pricingService.calculateOptimalPrice(
    request.destinationCountry(),
    request.weight()
);

entity.setDestinationCountry(request.destinationCountry().toUpperCase());
entity.setCostPrice(priceResult.costPrice());
entity.setSellerPrice(priceResult.sellerPrice());
entity.setPriceBreakdown(priceResult.breakdown());
```

### Task 9: Update PackageController

Update response mapping in all methods to pass user role to mapper:

```java
// Example for getPackages:
boolean isAdmin = user.getRole() == Role.ADMIN;
return packages.map(p -> packageMapper.toResponse(p, isAdmin));
```

---

## Frontend Implementation

### Task 1: Update Package Types

**File:** `src/types/package.ts`

```typescript
export interface Package {
  // ... existing fields ...
  destinationCountry: string;
  costPrice?: number;      // only present for admin
  sellerPrice: number;
  priceBreakdown?: string; // only present for admin
}

export interface CreatePackageRequest {
  // ... existing fields ...
  destinationCountry: string;
}
```

### Task 2: Create Country Utilities

**File:** `src/lib/utils.ts`

Add these functions:

```typescript
export function formatPrice(amount: number | undefined | null): string {
  if (amount == null) return '—';
  return `€${amount.toFixed(2)}`;
}

export const SUPPORTED_COUNTRIES: Record<string, string> = {
  AT: 'Austria',
  BA: 'Bosnia and Herzegovina',
  BE: 'Belgium',
  BG: 'Bulgaria',
  CH: 'Switzerland',
  CZ: 'Czechia',
  DE: 'Germany',
  DK: 'Denmark',
  EE: 'Estonia',
  ES: 'Spain',
  FI: 'Finland',
  FR: 'France',
  GR: 'Greece',
  HR: 'Croatia',
  HU: 'Hungary',
  IE: 'Ireland',
  IS: 'Iceland',
  IT: 'Italy',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  LV: 'Latvia',
  NL: 'Netherlands',
  PL: 'Poland',
  PT: 'Portugal',
  RO: 'Romania',
  RS: 'Serbia',
  SE: 'Sweden',
  SI: 'Slovenia',
  SK: 'Slovakia',
};

export function getCountryName(code: string): string {
  return SUPPORTED_COUNTRIES[code?.toUpperCase()] || code;
}

export function getCountryOptions(): { value: string; label: string }[] {
  return Object.entries(SUPPORTED_COUNTRIES)
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
```

### Task 3: Update Validations

**File:** `src/lib/validations.ts`

Add destinationCountry to createPackageSchema:

```typescript
destinationCountry: z.string().length(2, "Country code must be 2 characters"),
```

### Task 4: Update PackageForm

**File:** `src/components/forms/PackageForm.tsx`

Add country select field after the existing fields:

```tsx
import { SUPPORTED_COUNTRIES, getCountryOptions } from "@/lib/utils";

// Inside the form, add:
<FormField
  control={form.control}
  name="destinationCountry"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Destination Country</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value || "AT"}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {getCountryOptions().map((country) => (
            <SelectItem key={country.value} value={country.value}>
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

Set default value in useForm:

```typescript
const form = useForm({
  // ...
  defaultValues: {
    // ... existing defaults ...
    destinationCountry: "AT",
  },
});
```

### Task 5: Update Seller Package List

**File:** `src/app/(dashboard)/seller/packages/page.tsx`

Add Price column to the table/grid displaying packages:

```tsx
import { formatPrice, getCountryName } from "@/lib/utils";

// In the package card or table row:
<div>Price: {formatPrice(pkg.sellerPrice)}</div>
<div>Destination: {getCountryName(pkg.destinationCountry)}</div>
```

### Task 6: Update Seller Package Detail

**File:** `src/app/(dashboard)/seller/packages/[id]/page.tsx`

Add price display in the detail view:

```tsx
import { formatPrice, getCountryName } from "@/lib/utils";

// In the detail section:
<div className="flex items-center gap-2">
  <MapPin className="h-4 w-4" />
  <span>Destination: {getCountryName(pkg.destinationCountry)}</span>
</div>
<div className="flex items-center gap-2">
  <span className="font-semibold">Price: {formatPrice(pkg.sellerPrice)}</span>
</div>
```

### Task 7: Update Admin Package List

**File:** `src/app/(dashboard)/admin/packages/page.tsx`

Add Cost and Seller Price columns:

```tsx
import { formatPrice, getCountryName } from "@/lib/utils";

// In table headers:
<TableHead>Destination</TableHead>
<TableHead>Cost</TableHead>
<TableHead>Seller Price</TableHead>

// In table rows:
<TableCell>{getCountryName(pkg.destinationCountry)}</TableCell>
<TableCell>{formatPrice(pkg.costPrice)}</TableCell>
<TableCell>{formatPrice(pkg.sellerPrice)}</TableCell>
```

### Task 8: Update Admin Package Detail

**File:** `src/app/(dashboard)/admin/packages/[id]/page.tsx`

Add pricing section with breakdown:

```tsx
import { formatPrice, getCountryName } from "@/lib/utils";

// Add a pricing card/section:
<Card>
  <CardHeader>
    <CardTitle>Pricing Details</CardTitle>
  </CardHeader>
  <CardContent className="space-y-2">
    <div className="flex justify-between">
      <span className="text-muted-foreground">Destination:</span>
      <span>{getCountryName(pkg.destinationCountry)}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-muted-foreground">Weight:</span>
      <span>{pkg.weight} kg</span>
    </div>
    <Separator />
    <div className="flex justify-between">
      <span className="text-muted-foreground">Cost Price:</span>
      <span className="font-medium">{formatPrice(pkg.costPrice)}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-muted-foreground">Seller Price:</span>
      <span className="font-medium">{formatPrice(pkg.sellerPrice)}</span>
    </div>
    {pkg.priceBreakdown && (
      <div className="flex justify-between">
        <span className="text-muted-foreground">Calculation:</span>
        <span className="font-mono text-sm">{pkg.priceBreakdown}</span>
      </div>
    )}
  </CardContent>
</Card>
```

---

## Verification Tests

After implementation, verify these scenarios:

### Test 1: Simple Package (No Split)
```
Input: Austria (AT), 5kg
Expected:
- costPrice: €3.15
- sellerPrice: €6.30
- breakdown: "1×5kg"
```

### Test 2: Max Single Package
```
Input: Austria (AT), 31.5kg
Expected:
- costPrice: €4.95
- sellerPrice: €9.90
- breakdown: "1×31.5kg"
```

### Test 3: Oversized Package - Austria
```
Input: Austria (AT), 40kg
Expected: Optimal split found (should be around €8.30 cost)
Verify breakdown shows split like "1×25kg + 1×15kg" or similar optimal
```

### Test 4: Oversized Package - Germany
```
Input: Germany (DE), 40kg
Expected:
- costPrice: €12.05 (31.5kg=€7.00 + 8.5kg=€5.05)
- sellerPrice: €24.10
- breakdown: "1×31.5kg + 1×8.5kg"
```

### Test 5: Large Package
```
Input: Austria (AT), 100kg
Expected: Optimal split calculated
Should produce minimum cost combination
```

### Test 6: Role-Based Visibility
```
Same package viewed by:
- SELLER: sees sellerPrice, destinationCountry only (costPrice=null, breakdown=null)
- ADMIN: sees all fields including costPrice and breakdown
```

### Test 7: Validation
```
- Invalid country "XX" → Error: "Unsupported country"
- Weight ≤ 0 → Error: "Weight must be greater than 0"
```

### Test 8: Different Country Tiers
```
Test one package from each pricing tier to ensure correct prices:
- AT (Tier 1): 10kg → cost €3.55
- DE (Tier 2): 10kg → cost €7.00
- CZ (Tier 3): 10kg → cost €8.00
- FR (Tier 4): 10kg → cost €10.00
- ES (Tier 5): 10kg → cost €12.00
- BG (Tier 6): 10kg → cost €20.00
- IS (Tier 7): 10kg → cost €48.03
```

---

## Important Notes

1. **Do NOT modify existing package creation flow** - only add pricing calculation
2. **Do NOT change authentication or authorization** - only filter response fields by role
3. **Prices are in EUR** - display with € symbol and 2 decimal places
4. **Country codes are ISO 3166-1 alpha-2** - always uppercase, always 2 characters
5. **Seller price is ALWAYS cost × 2** - this ensures 50% profit margin
6. **Breakdown is human-readable** - format: "NxWEIGHTkg + NxWEIGHTkg"
