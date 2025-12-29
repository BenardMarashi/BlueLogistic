# Package Management Platform - V1 Requirements

## Project Overview

A package management platform for a logistics company that works with multiple sellers. Sellers can create packages, and admins can manage status and tracking.

---

## Business Story

### Problem

Our logistics company works with multiple sellers. Currently, sellers send us package information via email or WhatsApp. We manually type everything into Excel. We have no overview of which packages come from which seller, and status is not tracked.

### Solution

A central platform where sellers can enter their packages themselves. We see all packages sorted by seller and can manage status (Created → In Storage → Dispatched). When we have the tracking number, we enter it and the seller sees it immediately.

### Business Value

| Benefit | Impact |
|---------|--------|
| No manual data entry | Save time |
| All packages in one place | Better overview |
| Status tracking | No lost packages |
| Sellers see tracking | Fewer inquiries |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Java 21 + Spring Boot 3.5.9|
| **API** | REST API |
| **Database** | PostgreSQL |
| **ORM** | Spring Data JPA + Hibernate |
| **Auth** | Spring Security + JWT |
| **Frontend** | React / Next.js (separate project) |

---

## Features Overview (V1)

| Feature | Included |
|---------|----------|
| User Authentication | ✅ |
| Admin Dashboard | ✅ |
| Seller Dashboard | ✅ |
| Create Packages | ✅ |
| Status Workflow | ✅ |
| Manual Tracking Entry | ✅ |
| DPD Integration | ❌ (V2) |
| Vision AI Scanning | ❌ (V2) |

---

## User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **ADMIN** | Logistics company staff | See all packages, manage status, enter tracking, manage sellers |
| **SELLER** | External sellers | Create packages, see own packages, see tracking numbers |

---

## User Stories

### Epic 1: Authentication

| ID | User Story | Priority |
|----|------------|----------|
| AUTH-1 | As an **Admin**, I want to log in to access the admin dashboard. | Must |
| AUTH-2 | As a **Seller**, I want to log in to manage my packages. | Must |
| AUTH-3 | As an **Admin**, I want to create new seller accounts. | Must |
| AUTH-4 | As a **User**, I want to change my password. | Should |

### Epic 2: Seller - Package Management

| ID | User Story | Priority |
|----|------------|----------|
| SELL-1 | As a **Seller**, I want to create a new package with customer details and weight. | Must |
| SELL-2 | As a **Seller**, I want to see all my packages. | Must |
| SELL-3 | As a **Seller**, I want to see the status of my packages. | Must |
| SELL-4 | As a **Seller**, I want to see the tracking number when available. | Must |
| SELL-5 | As a **Seller**, I want to filter my packages by status. | Should |
| SELL-6 | As a **Seller**, I want to search my packages by customer name. | Should |

### Epic 3: Admin - Package Overview

| ID | User Story | Priority |
|----|------------|----------|
| ADM-1 | As an **Admin**, I want to see all packages grouped by seller. | Must |
| ADM-2 | As an **Admin**, I want to change the status of a package. | Must |
| ADM-3 | As an **Admin**, I want to manually enter a tracking number. | Must |
| ADM-4 | As an **Admin**, I want to filter packages by status. | Should |
| ADM-5 | As an **Admin**, I want to filter packages by seller. | Should |
| ADM-6 | As an **Admin**, I want to search packages by customer name or tracking number. | Should |

### Epic 4: Admin - Seller Management

| ID | User Story | Priority |
|----|------------|----------|
| SELMGT-1 | As an **Admin**, I want to see all sellers. | Must |
| SELMGT-2 | As an **Admin**, I want to create a new seller. | Must |
| SELMGT-3 | As an **Admin**, I want to deactivate a seller. | Should |
| SELMGT-4 | As an **Admin**, I want to see package count per seller. | Should |

---

## Status Workflow

```
CREATED  ──────►  IN_STORAGE  ──────►  DISPATCHED
(Seller          (Admin               (Admin ships +
creates)         receives)            adds tracking)
```

---

## Data Model

### User Entity
```
User
├── id: UUID (PK)
├── email: String (unique, not null)
├── passwordHash: String (not null)
├── name: String (not null)
├── role: Enum [ADMIN, SELLER] (not null)
├── createdAt: DateTime
└── updatedAt: DateTime
```

### Seller Entity
```
Seller
├── id: UUID (PK)
├── userId: UUID (FK → User, unique)
├── companyName: String (not null)
├── isActive: Boolean (default: true)
├── createdAt: DateTime
└── updatedAt: DateTime
```

### Package Entity
```
Package
├── id: UUID (PK)
├── sellerId: UUID (FK → Seller)
├── customerName: String (not null)
├── customerAddress: String (not null)
├── customerPostal: String (not null)
├── customerCity: String (not null)
├── customerPhone: String (not null)
├── customerEmail: String (nullable)
├── weight: Double (not null)
├── status: Enum [CREATED, IN_STORAGE, DISPATCHED]
├── trackingNumber: String (nullable)
├── createdAt: DateTime
├── receivedAt: DateTime (nullable)
├── dispatchedAt: DateTime (nullable)
└── updatedAt: DateTime
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Authenticated | Logout |
| GET | `/api/auth/me` | Authenticated | Get current user |
| PATCH | `/api/auth/password` | Authenticated | Change password |

### Packages
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/packages` | Authenticated | Get packages (filtered by role) |
| POST | `/api/packages` | Seller | Create new package |
| GET | `/api/packages/{id}` | Authenticated | Get package details |
| PATCH | `/api/packages/{id}/status` | Admin | Update status |
| PATCH | `/api/packages/{id}/tracking` | Admin | Add tracking number |
| DELETE | `/api/packages/{id}` | Admin | Delete package |

### Sellers
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/sellers` | Admin | Get all sellers |
| POST | `/api/sellers` | Admin | Create seller |
| GET | `/api/sellers/{id}` | Admin | Get seller details |
| PATCH | `/api/sellers/{id}` | Admin | Update seller |
| GET | `/api/sellers/{id}/packages` | Admin | Get seller's packages |

---

## Validation Rules

### Package Creation
| Field | Rules |
|-------|-------|
| customerName | Required, 2-100 chars |
| customerAddress | Required, 5-200 chars |
| customerPostal | Required, 4-10 chars |
| customerCity | Required, 2-100 chars |
| customerPhone | Required, valid phone format |
| customerEmail | Optional, valid email format |
| weight | Required, positive, max 1000 kg |

### Seller Creation
| Field | Rules |
|-------|-------|
| name | Required, 2-100 chars |
| companyName | Required, 2-100 chars |
| email | Required, valid email, unique |
| password | Required, min 8 chars |

---

## Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Password hashing | BCrypt |
| Authentication | JWT tokens |
| Token expiry | 24 hours |
| Role-based access | Spring Security @PreAuthorize |

---

# Backend Project Structure with File Limits

```
src/main/java/com/logistics/packagemanagement/
```

## Main Application
| File | Max Lines | Notes |
|------|-----------|-------|
| `PackageManagementApplication.java` | 20-30 | Just bootstrap, nothing else |

## Config Layer
| File | Max Lines | Notes |
|------|-----------|-------|
| `config/SecurityConfig.java` | 80-100 | Security filter chain, CORS, route rules |
| `config/JwtConfig.java` | 30-50 | JWT properties only |
| `config/CorsConfig.java` | 30-40 | CORS configuration only |
| `config/ApplicationConfig.java` | 40-60 | Beans like PasswordEncoder, AuthenticationProvider |

## Entity Layer
| File | Max Lines | Notes |
|------|-----------|-------|
| `entity/User.java` | 60-80 | Fields, relationships, lifecycle hooks |
| `entity/Seller.java` | 60-80 | Fields, relationships, lifecycle hooks |
| `entity/Package.java` | 80-100 | More fields, keep focused |
| `entity/enums/Role.java` | 10-15 | Just enum values |
| `entity/enums/PackageStatus.java` | 10-15 | Just enum values |

## Repository Layer
| File | Max Lines | Notes |
|------|-----------|-------|
| `repository/UserRepository.java` | 20-40 | Interface with query methods |
| `repository/SellerRepository.java` | 30-50 | Interface with query methods |
| `repository/PackageRepository.java` | 50-80 | More queries for filtering/search |

## Service Layer
| File | Max Lines | Notes |
|------|-----------|-------|
| `service/AuthService.java` | 80-120 | Login, token generation, password change |
| `service/UserService.java` | 60-80 | User CRUD operations |
| `service/SellerService.java` | 100-150 | Seller management + package counts |
| `service/PackageService.java` | 150-200 | Package CRUD, status workflow, filtering |

**If PackageService exceeds 200 lines:** Extract `PackageStatusService` for status workflow logic.

## Controller Layer
| File | Max Lines | Notes |
|------|-----------|-------|
| `controller/AuthController.java` | 60-80 | 4 endpoints, keep thin |
| `controller/SellerController.java` | 60-80 | 5 endpoints, keep thin |
| `controller/PackageController.java` | 80-100 | 6 endpoints, keep thin |

**Rule:** Controllers should only do: receive request → call service → return response. No business logic.

## DTO Layer - Requests
| File | Max Lines | Notes |
|------|-----------|-------|
| `dto/request/LoginRequest.java` | 10-15 | Record with validation |
| `dto/request/CreatePackageRequest.java` | 25-35 | Record with validation |
| `dto/request/CreateSellerRequest.java` | 20-25 | Record with validation |
| `dto/request/UpdateStatusRequest.java` | 10-15 | Record with validation |
| `dto/request/UpdateTrackingRequest.java` | 10-15 | Record with validation |
| `dto/request/ChangePasswordRequest.java` | 15-20 | Record with validation |

## DTO Layer - Responses
| File | Max Lines | Notes |
|------|-----------|-------|
| `dto/response/AuthResponse.java` | 10-15 | Record |
| `dto/response/UserResponse.java` | 10-15 | Record (no password!) |
| `dto/response/PackageResponse.java` | 20-30 | Record |
| `dto/response/SellerResponse.java` | 15-25 | Record |
| `dto/response/ErrorResponse.java` | 20-30 | Record with factory methods |

## Mapper Layer
| File | Max Lines | Notes |
|------|-----------|-------|
| `mapper/UserMapper.java` | 30-50 | Entity ↔ DTO conversions |
| `mapper/SellerMapper.java` | 40-60 | Entity ↔ DTO conversions |
| `mapper/PackageMapper.java` | 50-70 | Entity ↔ DTO conversions |

## Security Layer
| File | Max Lines | Notes |
|------|-----------|-------|
| `security/JwtTokenProvider.java` | 80-100 | Generate, validate, parse tokens |
| `security/JwtAuthenticationFilter.java` | 50-70 | Extract and validate token from request |
| `security/UserDetailsServiceImpl.java` | 30-50 | Load user from database |

## Exception Layer
| File | Max Lines | Notes |
|------|-----------|-------|
| `exception/GlobalExceptionHandler.java` | 80-120 | All @ExceptionHandler methods |
| `exception/ResourceNotFoundException.java` | 10-15 | Custom exception |
| `exception/UnauthorizedException.java` | 10-15 | Custom exception |
| `exception/InvalidStatusTransitionException.java` | 10-15 | Custom exception |
| `exception/DuplicateResourceException.java` | 10-15 | Custom exception |

---

# Frontend Project Structure with File Limits

```
src/
```

## Pages (Next.js App Router)
| File | Max Lines | Notes |
|------|-----------|-------|
| `app/layout.tsx` | 40-60 | Root layout, providers |
| `app/page.tsx` | 20-30 | Redirect to login or dashboard |
| `app/(auth)/login/page.tsx` | 80-120 | Login form and logic |
| `app/(dashboard)/seller/packages/page.tsx` | 80-120 | Package list with filters |
| `app/(dashboard)/seller/packages/new/page.tsx` | 60-80 | Create package form |
| `app/(dashboard)/seller/packages/[id]/page.tsx` | 60-80 | Package details view |
| `app/(dashboard)/admin/packages/page.tsx` | 100-150 | All packages with grouping |
| `app/(dashboard)/admin/packages/[id]/page.tsx` | 80-120 | Package details + status/tracking |
| `app/(dashboard)/admin/sellers/page.tsx` | 80-120 | Seller list |
| `app/(dashboard)/admin/sellers/new/page.tsx` | 60-80 | Create seller form |
| `app/(dashboard)/admin/sellers/[id]/page.tsx` | 80-120 | Seller details + packages |

**If any page exceeds limit:** Extract sections into components.

## Components - UI
| File | Max Lines | Notes |
|------|-----------|-------|
| `components/ui/Button.tsx` | 40-60 | Reusable button variants |
| `components/ui/Input.tsx` | 40-60 | Reusable input with error state |
| `components/ui/Badge.tsx` | 30-40 | Status badges |
| `components/ui/Card.tsx` | 30-40 | Card container |
| `components/ui/Table.tsx` | 60-80 | Reusable table |
| `components/ui/Modal.tsx` | 50-70 | Modal dialog |
| `components/ui/Spinner.tsx` | 15-20 | Loading indicator |

## Components - Forms
| File | Max Lines | Notes |
|------|-----------|-------|
| `components/forms/LoginForm.tsx` | 80-120 | Login form with validation |
| `components/forms/PackageForm.tsx` | 120-150 | Package creation form |
| `components/forms/SellerForm.tsx` | 100-130 | Seller creation form |
| `components/forms/StatusUpdateForm.tsx` | 50-70 | Status dropdown + submit |
| `components/forms/TrackingForm.tsx` | 50-70 | Tracking input + submit |

## Components - Layout
| File | Max Lines | Notes |
|------|-----------|-------|
| `components/layout/Header.tsx` | 50-80 | Navigation, user menu |
| `components/layout/Sidebar.tsx` | 60-80 | Navigation links |
| `components/layout/DashboardLayout.tsx` | 40-60 | Layout wrapper |

## Components - Features
| File | Max Lines | Notes |
|------|-----------|-------|
| `components/packages/PackageList.tsx` | 100-130 | Package table/list |
| `components/packages/PackageCard.tsx` | 50-70 | Single package card |
| `components/packages/PackageFilters.tsx` | 60-80 | Filter controls |
| `components/packages/StatusBadge.tsx` | 30-40 | Status with color |
| `components/sellers/SellerList.tsx` | 80-100 | Seller table |
| `components/sellers/SellerCard.tsx` | 50-70 | Single seller card |

## Hooks
| File | Max Lines | Notes |
|------|-----------|-------|
| `hooks/useAuth.ts` | 60-80 | Auth state and methods |
| `hooks/usePackages.ts` | 50-70 | Package queries and mutations |
| `hooks/useSellers.ts` | 50-70 | Seller queries and mutations |
| `hooks/useDebounce.ts` | 15-20 | Debounce utility |

## Services
| File | Max Lines | Notes |
|------|-----------|-------|
| `services/api.ts` | 60-80 | Base API client |
| `services/auth-service.ts` | 40-60 | Auth API calls |
| `services/package-service.ts` | 50-70 | Package API calls |
| `services/seller-service.ts` | 40-60 | Seller API calls |

## Types
| File | Max Lines | Notes |
|------|-----------|-------|
| `types/auth.ts` | 20-30 | Auth-related types |
| `types/package.ts` | 30-40 | Package types |
| `types/seller.ts` | 20-30 | Seller types |
| `types/api.ts` | 20-30 | API response types |

## Lib/Utils
| File | Max Lines | Notes |
|------|-----------|-------|
| `lib/utils.ts` | 40-60 | Helper functions |
| `lib/constants.ts` | 30-40 | App constants |
| `lib/validations.ts` | 50-70 | Zod schemas |

---

# File Limit Quick Reference

| Category | Typical Range | Hard Max | Action if Exceeded |
|----------|---------------|----------|-------------------|
| Controllers | 60-80 | 100 | Split by sub-resource |
| Services | 100-150 | 200 | Extract helper service |
| Entities | 60-80 | 100 | Review responsibilities |
| DTOs (Records) | 10-30 | 50 | Normal, records are small |
| Repositories | 30-50 | 80 | Fine, queries can grow |
| Config | 40-60 | 100 | Split by concern |
| Page Components | 80-120 | 150 | Extract into components |
| UI Components | 40-60 | 80 | Split into smaller parts |
| Form Components | 100-130 | 150 | Extract field groups |
| Hooks | 50-70 | 100 | Split by concern |
| Services (FE) | 40-60 | 80 | One per resource |
| Types | 20-40 | 50 | Split by domain |

---

# Warning Signs to Split Files

**Split immediately when you see:**
- Scrolling more than 3 screens to understand the file
- Multiple unrelated methods grouped together
- Comments like `// --- Section X ---` to organize
- More than 6 public methods in a service
- More than 4 useEffect hooks in a component
- Copy-pasting similar logic within the same file
- Difficulty naming the file (sign of mixed responsibilities)

---

## Definition of Done

- [ ] Code compiles without errors
- [ ] All endpoints return correct responses
- [ ] Authentication works for both roles
- [ ] Role-based access control enforced
- [ ] Database relationships working
- [ ] Validation errors return proper messages
- [ ] **No file exceeds its maximum line limit**
- [ ] API documentation (Swagger/OpenAPI)
- [ ] README with setup instructions
