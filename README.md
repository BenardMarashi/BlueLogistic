# BlueLogistic - Package Management Platform

A comprehensive package management platform for logistics companies working with multiple sellers.

## Project Structure

```
BlueLogistic/
├── blue-logistic/              # Backend API (Spring Boot + Java 21)
├── blue-logistic-frontend/     # Dashboard App (Next.js + React 19)
├── bluelogistic-landing/       # Landing Page (Next.js + React 19)
└── docker-compose.yml          # PostgreSQL database
```

## Prerequisites

| Software | Version | Download |
|----------|---------|----------|
| Docker Desktop | Latest | https://www.docker.com/products/docker-desktop |
| Java JDK | 21+ | https://adoptium.net/ |
| Node.js | 20+ | https://nodejs.org/ |

**Verify installations:**
```bash
docker --version
java -version
node -v
npm -v
```

## Quick Start

### Step 1: Configure Environment

Copy the example environment files and update with your own values:

```bash
# Root (for Docker)
cp .env.example .env

# Frontend
cp blue-logistic-frontend/.env.example blue-logistic-frontend/.env.local
```

### Step 2: Start PostgreSQL (Docker)

```bash
docker-compose up -d
docker ps  # Verify container is running
```

### Step 3: Start Backend API (Port 8080)

```bash
cd blue-logistic
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Wait until you see: `Started BlueLogisticApplication`

**URLs:**
- API: http://localhost:8080
- Swagger Docs: http://localhost:8080/swagger-ui.html

### Step 4: Start Frontend Dashboard (Port 3000)

Open a **new terminal**:

```bash
cd blue-logistic-frontend
npm install
npm run dev
```

**URL:** http://localhost:3000

### Step 5: Start Landing Page (Port 3001)

Open a **new terminal**:

```bash
cd bluelogistic-landing
npm install
npm run dev -- -p 3001
```

**URL:** http://localhost:3001

## Service Overview

| Service | Port | URL |
|---------|------|-----|
| PostgreSQL | 5432 | - |
| Backend API | 8080 | http://localhost:8080 |
| Dashboard | 3000 | http://localhost:3000 |
| Landing Page | 3001 | http://localhost:3001 |

## Environment Configuration

See `.env.example` files in each directory for required environment variables.

## Common Commands

### Docker (PostgreSQL)

```bash
docker-compose up -d      # Start database
docker-compose down       # Stop database
docker-compose down -v    # Stop and remove data
docker-compose logs -f    # View logs
```

### Backend

```bash
cd blue-logistic
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev  # Dev server
./mvnw test                                             # Run tests
./mvnw clean package -DskipTests                        # Build JAR
```

### Frontend / Landing Page

```bash
npm install     # Install dependencies
npm run dev     # Development server
npm run build   # Production build
npm start       # Start production server
```

## Tech Stack

### Backend
- Spring Boot 3.5.9
- Java 21
- PostgreSQL 16
- Spring Security + JWT
- Flyway Migrations
- OpenAPI/Swagger

### Frontend (Dashboard & Landing)
- Next.js 16
- React 19
- TypeScript
- TailwindCSS
- Shadcn/ui

## API Endpoints

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

## Package Status Workflow

```
CREATED  ──►  IN_STORAGE  ──►  DISPATCHED
   │              │                │
 Seller        Admin            Admin
creates      receives       ships + adds
package      package      tracking number
```

## Troubleshooting

### Docker/PostgreSQL Issues

```bash
# Check if port 5432 is in use
lsof -i :5432

# Reset database
docker-compose down -v && docker-compose up -d

# View logs
docker-compose logs postgres
```

### Backend Issues

- Ensure Docker container is running: `docker ps`
- Check database logs: `docker-compose logs postgres`
- Kill process on port 8080: `lsof -i :8080` then `kill -9 <PID>`

### Frontend Issues

- Ensure backend is running on port 8080
- Verify `.env.local` configuration
- Restart after changing environment variables

## Starting All Services

```bash
# Terminal 1 - Database
docker-compose up -d

# Terminal 2 - Backend
cd blue-logistic && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Terminal 3 - Dashboard
cd blue-logistic-frontend && npm install && npm run dev

# Terminal 4 - Landing Page
cd bluelogistic-landing && npm install && npm run dev -- -p 3001
```

## License

This project is proprietary software.
