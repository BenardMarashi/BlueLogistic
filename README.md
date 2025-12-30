# BlueLogistic - Package Management Platform

## Overview
A package management platform for a logistics company that works with multiple sellers.

## Features
- **Sellers** can create packages with customer details
- **Admins** can manage package status and tracking numbers
- JWT-based authentication
- Role-based access control

## Tech Stack
- Java 21
- Spring Boot 3.5.9
- PostgreSQL
- Spring Security + JWT
- Flyway migrations

## Prerequisites
- Java 21+
- PostgreSQL 15+
- Maven 3.9+

## Setup

### 1. Create Database
```bash
createdb bluelogistic
```

### 2. Configure Database (optional)
Edit `src/main/resources/application-dev.yml` if needed:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/bluelogistic
    username: bluelogistic
    password: bluelogistic123
```

### 3. Run Application
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

## Default Admin Credentials
- Email: `admin@bluelogistic.com`
- Password: `admin123`

## API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Authenticated | Get current user |
| PATCH | `/api/auth/password` | Authenticated | Change password |

### Packages
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/packages` | Authenticated | List packages (role-filtered) |
| POST | `/api/packages` | Seller | Create package |
| GET | `/api/packages/{id}` | Authenticated | Get package details |
| PATCH | `/api/packages/{id}/status` | Admin | Update status |
| PATCH | `/api/packages/{id}/tracking` | Admin | Add tracking number |
| DELETE | `/api/packages/{id}` | Admin | Delete package |

### Sellers (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sellers` | List all sellers |
| POST | `/api/sellers` | Create seller |
| GET | `/api/sellers/{id}` | Get seller details |
| PATCH | `/api/sellers/{id}/status` | Update seller status |
| GET | `/api/sellers/{id}/packages` | Get seller's packages |

## Package Status Workflow
```
CREATED → IN_STORAGE → DISPATCHED
```

## Testing
```bash
./mvnw test
```

## Build for Production
```bash
./mvnw clean package -DskipTests
java -jar target/blue-logistic-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```