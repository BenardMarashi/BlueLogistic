# BlueLogistic - Package Management Platform

A comprehensive package management platform for logistics companies working with multiple sellers.

## 🚀 Features

- **User Authentication** - JWT-based authentication with role-based access
- **Admin Dashboard** - View all packages, manage status, add tracking numbers
- **Seller Dashboard** - Create packages, view own packages and tracking
- **Status Workflow** - CREATED → IN_STORAGE → DISPATCHED
- **Package Management** - Full CRUD operations with validation

## 🛠️ Tech Stack

- **Framework**: Spring Boot 3.5.9
- **Language**: Java 21
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA + Hibernate
- **Auth**: Spring Security + JWT
- **Migration**: Flyway
- **Build**: Maven

## 📋 Prerequisites

- Java 21+
- PostgreSQL 15+
- Maven 3.9+

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd blue-logistic
```

### 2. Create PostgreSQL database

```sql
CREATE DATABASE bluelogistic;
CREATE USER bluelogistic WITH PASSWORD 'bluelogistic123';
GRANT ALL PRIVILEGES ON DATABASE bluelogistic TO bluelogistic;
```

### 3. Configure environment (optional)

Default configuration uses:
- Database: `localhost:5432/bluelogistic`
- Username: `bluelogistic`
- Password: `bluelogistic123`

To customize, set environment variables or edit `application-dev.yml`.

### 4. Run the application

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

The API will be available at `http://localhost:8080`

## 🔐 Default Admin Account

- **Email**: admin@bluelogistic.com
- **Password**: admin123

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | Required |
| PATCH | `/api/auth/password` | Change password | Required |

### Packages

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/packages` | List packages | All |
| POST | `/api/packages` | Create package | SELLER |
| GET | `/api/packages/{id}` | Get package | All |
| PATCH | `/api/packages/{id}/status` | Update status | ADMIN |
| PATCH | `/api/packages/{id}/tracking` | Add tracking | ADMIN |
| DELETE | `/api/packages/{id}` | Delete package | ADMIN |

### Sellers (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sellers` | List sellers |
| POST | `/api/sellers` | Create seller |
| GET | `/api/sellers/{id}` | Get seller |
| PATCH | `/api/sellers/{id}/status` | Update status |
| GET | `/api/sellers/{id}/packages` | Get seller's packages |

## 📦 Package Status Workflow

```
CREATED  →  IN_STORAGE  →  DISPATCHED
  ↑            ↑              ↑
Seller      Admin          Admin
creates    receives     ships + tracking
```

## 🧪 Testing

### Run all tests
```bash
./mvnw test
```

### Run with coverage
```bash
./mvnw test jacoco:report
```

## 📁 Project Structure

```
src/main/java/com/bluelogistic/
├── config/          # Security, JWT configuration
├── controller/      # REST controllers
├── dto/             # Request/Response DTOs
├── entity/          # JPA entities
├── exception/       # Custom exceptions + handler
├── mapper/          # Entity ↔ DTO mappers
├── repository/      # Data access layer
└── service/         # Business logic
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | jdbc:postgresql://localhost:5432/bluelogistic | Database URL |
| `DB_USERNAME` | bluelogistic | Database username |
| `DB_PASSWORD` | bluelogistic123 | Database password |
| `JWT_SECRET` | (auto-generated) | JWT signing key |

## 📝 API Examples

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bluelogistic.com","password":"admin123"}'
```

### Create Seller (as Admin)
```bash
curl -X POST http://localhost:8080/api/sellers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "John Seller",
    "email": "john@example.com",
    "password": "password123",
    "companyName": "Johns Shop"
  }'
```

### Create Package (as Seller)
```bash
curl -X POST http://localhost:8080/api/packages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "description": "Electronics",
    "weight": 2.5,
    "customerName": "Jane Doe",
    "customerEmail": "jane@example.com",
    "customerPhone": "+1234567890",
    "deliveryAddress": "123 Main St, City"
  }'
```

## 📄 License

This project is proprietary software.