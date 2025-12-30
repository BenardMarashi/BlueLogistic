-- Create initial admin user
-- Default password: admin123 (BCrypt hash)
INSERT INTO users (id, email, password_hash, name, role)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'admin@bluelogistic.com',
    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
    'System Administrator',
    'ADMIN'
);