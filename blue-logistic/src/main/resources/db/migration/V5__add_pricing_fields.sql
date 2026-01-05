-- Add pricing-related columns to packages table
ALTER TABLE packages ADD COLUMN destination_country VARCHAR(2) NOT NULL DEFAULT 'AT';
ALTER TABLE packages ADD COLUMN cost_price DECIMAL(10,2);
ALTER TABLE packages ADD COLUMN seller_price DECIMAL(10,2);
ALTER TABLE packages ADD COLUMN price_breakdown VARCHAR(255);

-- Add index for country-based queries
CREATE INDEX idx_packages_destination_country ON packages(destination_country);
