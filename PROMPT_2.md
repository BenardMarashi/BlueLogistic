# PROMPT 2: TypeScript Types & API Services

Working directory: ~/BlueLogistic/blue-logistic-frontend/src/

## File 1: src/types/auth.ts

```typescript
export type UserRole = "ADMIN" | "SELLER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
```

## File 2: src/types/package.ts

```typescript
export type PackageStatus = "CREATED" | "IN_STORAGE" | "DISPATCHED";

export interface Package {
  id: string;
  sellerId: string;
  sellerName: string;
  trackingNumber: string | null;
  description: string;
  weight: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  status: PackageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageRequest {
  description: string;
  weight: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
}

export interface UpdateStatusRequest {
  status: PackageStatus;
}

export interface UpdateTrackingRequest {
  trackingNumber: string;
}
```

## File 3: src/types/seller.ts

```typescript
export interface Seller {
  id: string;
  userId: string;
  name: string;
  email: string;
  companyName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSellerRequest {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

export interface UpdateSellerStatusRequest {
  isActive: boolean;
}
```

## File 4: src/types/api.ts

```typescript
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiError {
  error?: string;
  errors?: Record<string, string>;
  message?: string;
  status?: number;
}
```

## File 5: src/types/index.ts

```typescript
export * from "./auth";
export * from "./package";
export * from "./seller";
export * from "./api";
```

## File 6: src/lib/constants.ts

```typescript
import { PackageStatus } from "@/types";

export const APP_NAME = "BlueLogistic";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const AUTH_TOKEN_KEY = "bluelogistic_token";
export const AUTH_USER_KEY = "bluelogistic_user";

export const PAGINATION_DEFAULT_SIZE = 20;
export const DEBOUNCE_DELAY = 300;
export const TOAST_DURATION = 5000;

export const STATUS_LABELS: Record<PackageStatus, string> = {
  CREATED: "Created",
  IN_STORAGE: "In Storage",
  DISPATCHED: "Dispatched",
};

export const STATUS_COLORS: Record<PackageStatus, string> = {
  CREATED: "bg-slate-100 text-slate-700 border-slate-200",
  IN_STORAGE: "bg-blue-100 text-blue-700 border-blue-200",
  DISPATCHED: "bg-green-100 text-green-700 border-green-200",
};

export const STATUS_NEXT: Record<PackageStatus, PackageStatus | null> = {
  CREATED: "IN_STORAGE",
  IN_STORAGE: "DISPATCHED",
  DISPATCHED: null,
};
```

## File 7: src/lib/utils.ts

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PackageStatus } from "@/types";
import { STATUS_LABELS, STATUS_COLORS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusLabel(status: PackageStatus): string {
  return STATUS_LABELS[status] || status;
}

export function getStatusColor(status: PackageStatus): string {
  return STATUS_COLORS[status] || "bg-gray-100 text-gray-700";
}

export function formatWeight(weight: number): string {
  return `${weight.toFixed(2)} kg`;
}
```

## File 8: src/lib/validations.ts

```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const createPackageSchema = z.object({
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  weight: z.number({ invalid_type_error: "Weight must be a number" }).positive("Weight must be positive").max(1000, "Weight cannot exceed 1000 kg"),
  customerName: z.string().min(2, "Customer name must be at least 2 characters").max(100, "Customer name too long"),
  customerEmail: z.string().min(1, "Customer email is required").email("Invalid email format"),
  customerPhone: z.string().min(8, "Phone must be at least 8 characters").regex(/^\+?[0-9\s\-]+$/, "Invalid phone format"),
  deliveryAddress: z.string().min(5, "Address must be at least 5 characters").max(500, "Address too long"),
});

export const createSellerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters").max(100, "Company name too long"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CreatePackageFormData = z.infer<typeof createPackageSchema>;
export type CreateSellerFormData = z.infer<typeof createSellerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
```

## File 9: src/services/api.ts

```typescript
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_URL, AUTH_TOKEN_KEY } from "@/lib/constants";
import { ApiError } from "@/types";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

## File 10: src/services/auth-service.ts

```typescript
import api from "./api";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/constants";
import { LoginRequest, LoginResponse, User, ChangePasswordRequest } from "@/types";

export const authService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/api/auth/login", request);
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify({
      id: data.userId, email: data.email, name: data.name, role: data.role,
    }));
    return data;
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>("/api/auth/me");
    return data;
  },

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    await api.patch("/api/auth/password", request);
  },

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = "/login";
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  getStoredUser(): User | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(AUTH_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
```

## File 11: src/services/package-service.ts

```typescript
import api from "./api";
import { Package, CreatePackageRequest, UpdateStatusRequest, UpdateTrackingRequest, PaginatedResponse } from "@/types";

export const packageService = {
  async getPackages(page = 0, size = 20): Promise<PaginatedResponse<Package>> {
    const { data } = await api.get<PaginatedResponse<Package>>("/api/packages", { params: { page, size } });
    return data;
  },

  async getPackageById(id: string): Promise<Package> {
    const { data } = await api.get<Package>(`/api/packages/${id}`);
    return data;
  },

  async createPackage(request: CreatePackageRequest): Promise<Package> {
    const { data } = await api.post<Package>("/api/packages", request);
    return data;
  },

  async updateStatus(id: string, request: UpdateStatusRequest): Promise<Package> {
    const { data } = await api.patch<Package>(`/api/packages/${id}/status`, request);
    return data;
  },

  async updateTracking(id: string, request: UpdateTrackingRequest): Promise<Package> {
    const { data } = await api.patch<Package>(`/api/packages/${id}/tracking`, request);
    return data;
  },

  async deletePackage(id: string): Promise<void> {
    await api.delete(`/api/packages/${id}`);
  },
};
```

## File 12: src/services/seller-service.ts

```typescript
import api from "./api";
import { Seller, CreateSellerRequest, UpdateSellerStatusRequest, PaginatedResponse } from "@/types";

export const sellerService = {
  async getSellers(page = 0, size = 20): Promise<PaginatedResponse<Seller>> {
    const { data } = await api.get<PaginatedResponse<Seller>>("/api/sellers", { params: { page, size } });
    return data;
  },

  async getSellerById(id: string): Promise<Seller> {
    const { data } = await api.get<Seller>(`/api/sellers/${id}`);
    return data;
  },

  async createSeller(request: CreateSellerRequest): Promise<Seller> {
    const { data } = await api.post<Seller>("/api/sellers", request);
    return data;
  },

  async updateSellerStatus(id: string, request: UpdateSellerStatusRequest): Promise<Seller> {
    const { data } = await api.patch<Seller>(`/api/sellers/${id}/status`, request);
    return data;
  },
};
```

## File 13: src/services/index.ts

```typescript
export { authService } from "./auth-service";
export { packageService } from "./package-service";
export { sellerService } from "./seller-service";
```

---

Create all these files with the exact content provided. After completion, run `npm run dev` to verify no errors.
