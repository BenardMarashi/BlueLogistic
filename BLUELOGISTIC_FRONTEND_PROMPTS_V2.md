# BlueLogistic Frontend - Claude Code Implementation Prompts

## 📁 CRITICAL: Project Location

Your current structure:
```
BlueLogistic/                          ← Parent folder (you are here)
├── blue-logistic/                     ← Backend (Spring Boot) - EXISTS
│   ├── src/main/java/com/bluelogistic/
│   ├── pom.xml
│   └── mvnw
├── BEST_PRACTICES.md
├── PROJECT_REQUIREMENTS.md
├── CLAUDE.md
└── README.md
```

**Create frontend as a SIBLING folder:**
```
BlueLogistic/                          ← Parent folder
├── blue-logistic/                     ← Backend (existing)
├── blue-logistic-frontend/            ← Frontend (CREATE THIS)
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   └── types/
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── README.md
```

---

## 🎨 Brand Identity

| Element | Value | Usage |
|---------|-------|-------|
| **Primary Color** | `#0D2556` | Sidebar, headers, primary buttons, navigation |
| **Accent Color** | `#D8420E` | CTAs, highlights, active states, important actions |
| **Background** | `#F8FAFC` | Main content area |
| **Cards** | `#FFFFFF` | Card backgrounds |

---

## 🔌 Backend API Reference

**Base URL:** `http://localhost:8080`

**Test Credentials:**
- Admin: `admin@bluelogistic.com` / `password`
- Seller: `john@shop.com` / `seller123`

---

# PROMPT 1: Project Initialization

Copy this entire prompt into Claude Code:

```
I need to create a Next.js frontend for BlueLogistic package management platform.

## IMPORTANT: Directory Location
- I am currently in the `BlueLogistic/` parent directory
- There is an existing `blue-logistic/` folder containing the Spring Boot backend
- Create the frontend as `blue-logistic-frontend/` (sibling to backend)

## Step 1: Create Next.js Project
Run these commands from the BlueLogistic/ parent directory:

cd ~/BlueLogistic
npx create-next-app@latest blue-logistic-frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

When prompted:
- Would you like to use TypeScript? Yes
- Would you like to use ESLint? Yes
- Would you like to use Tailwind CSS? Yes
- Would you like to use `src/` directory? Yes
- Would you like to use App Router? Yes
- Would you like to customize the default import alias? Yes (@/*)

## Step 2: Install Dependencies
cd blue-logistic-frontend
npx shadcn@latest init

When shadcn prompts:
- Which style would you like to use? Default
- Which color would you like to use as base color? Slate
- Would you like to use CSS variables for colors? Yes

Then install packages:
npm install @tanstack/react-query axios zod react-hook-form @hookform/resolvers lucide-react js-cookie
npm install -D @types/js-cookie

Add shadcn components:
npx shadcn@latest add button input label card table badge dialog select dropdown-menu avatar separator sheet toast form tabs textarea skeleton alert

## Step 3: Create Folder Structure
Create these folders inside blue-logistic-frontend/src/:

src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   ├── packages/
│   │   │   │   └── [id]/
│   │   │   └── sellers/
│   │   │       ├── new/
│   │   │       └── [id]/
│   │   └── seller/
│   │       └── packages/
│   │           ├── new/
│   │           └── [id]/
│   └── providers.tsx
├── components/
│   ├── forms/
│   ├── layout/
│   ├── packages/
│   ├── sellers/
│   └── ui/  (shadcn puts components here)
├── hooks/
├── lib/
├── services/
└── types/

## Step 4: Environment Variables
Create blue-logistic-frontend/.env.local:

NEXT_PUBLIC_API_URL=http://localhost:8080

## Step 5: Configure Brand Colors
Replace the contents of src/app/globals.css with:

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 210 40% 98%;
    --foreground: 215 71% 19%;
    
    --card: 0 0% 100%;
    --card-foreground: 215 71% 19%;
    
    --popover: 0 0% 100%;
    --popover-foreground: 215 71% 19%;
    
    --primary: 215 71% 19%;
    --primary-foreground: 0 0% 100%;
    
    --secondary: 210 40% 96%;
    --secondary-foreground: 215 71% 19%;
    
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    
    --accent: 15 90% 45%;
    --accent-foreground: 0 0% 100%;
    
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 215 71% 19%;
    
    --radius: 0.5rem;
    
    --chart-1: 215 71% 19%;
    --chart-2: 15 90% 45%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 215 71% 8%;
    --foreground: 210 40% 98%;
    
    --card: 215 71% 12%;
    --card-foreground: 210 40% 98%;
    
    --popover: 215 71% 12%;
    --popover-foreground: 210 40% 98%;
    
    --primary: 15 90% 45%;
    --primary-foreground: 0 0% 100%;
    
    --secondary: 215 71% 19%;
    --secondary-foreground: 210 40% 98%;
    
    --muted: 215 71% 19%;
    --muted-foreground: 215 16% 65%;
    
    --accent: 215 71% 25%;
    --accent-foreground: 210 40% 98%;
    
    --destructive: 0 62% 50%;
    --destructive-foreground: 210 40% 98%;
    
    --border: 215 71% 19%;
    --input: 215 71% 19%;
    --ring: 15 90% 45%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom utility classes */
.text-brand-blue {
  color: #0D2556;
}

.text-brand-orange {
  color: #D8420E;
}

.bg-brand-blue {
  background-color: #0D2556;
}

.bg-brand-orange {
  background-color: #D8420E;
}

## Step 6: Update tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0D2556",
          orange: "#D8420E",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

## Verification
After completing all steps, run:
cd blue-logistic-frontend
npm run dev

The app should start on http://localhost:3000 without errors.

DO NOT create any page components yet - just the folder structure and configuration.
```

---

# PROMPT 2: TypeScript Types & API Services

```
Create the TypeScript types and API service layer for BlueLogistic frontend.

Working directory: blue-logistic-frontend/src/

## File 1: src/types/auth.ts

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

## File 2: src/types/package.ts

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

## File 3: src/types/seller.ts

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

## File 4: src/types/api.ts

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

## File 5: src/types/index.ts

export * from "./auth";
export * from "./package";
export * from "./seller";
export * from "./api";

## File 6: src/lib/constants.ts

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

## File 7: src/lib/utils.ts

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

## File 8: src/lib/validations.ts

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const createPackageSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
  weight: z
    .number({ invalid_type_error: "Weight must be a number" })
    .positive("Weight must be positive")
    .max(1000, "Weight cannot exceed 1000 kg"),
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name too long"),
  customerEmail: z
    .string()
    .min(1, "Customer email is required")
    .email("Invalid email format"),
  customerPhone: z
    .string()
    .min(8, "Phone must be at least 8 characters")
    .regex(/^\+?[0-9\s\-]+$/, "Invalid phone format"),
  deliveryAddress: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address too long"),
});

export const createSellerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name too long"),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CreatePackageFormData = z.infer<typeof createPackageSchema>;
export type CreateSellerFormData = z.infer<typeof createSellerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

## File 9: src/services/api.ts

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_URL, AUTH_TOKEN_KEY } from "@/lib/constants";
import { ApiError } from "@/types";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
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

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        // Don't redirect if already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

## File 10: src/services/auth-service.ts

import api from "./api";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/constants";
import { LoginRequest, LoginResponse, User, ChangePasswordRequest } from "@/types";

export const authService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/api/auth/login", request);
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify({
      id: data.userId,
      email: data.email,
      name: data.name,
      role: data.role,
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

## File 11: src/services/package-service.ts

import api from "./api";
import {
  Package,
  CreatePackageRequest,
  UpdateStatusRequest,
  UpdateTrackingRequest,
  PaginatedResponse,
} from "@/types";

export const packageService = {
  async getPackages(page = 0, size = 20): Promise<PaginatedResponse<Package>> {
    const { data } = await api.get<PaginatedResponse<Package>>("/api/packages", {
      params: { page, size },
    });
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

## File 12: src/services/seller-service.ts

import api from "./api";
import {
  Seller,
  CreateSellerRequest,
  UpdateSellerStatusRequest,
  PaginatedResponse,
} from "@/types";

export const sellerService = {
  async getSellers(page = 0, size = 20): Promise<PaginatedResponse<Seller>> {
    const { data } = await api.get<PaginatedResponse<Seller>>("/api/sellers", {
      params: { page, size },
    });
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

## File 13: src/services/index.ts

export { authService } from "./auth-service";
export { packageService } from "./package-service";
export { sellerService } from "./seller-service";

Create all these files with the exact content provided. Ensure proper TypeScript types throughout.
```

---

# PROMPT 3: Authentication System

```
Create the authentication system for BlueLogistic frontend.

Working directory: blue-logistic-frontend/src/

## File 1: src/hooks/useAuth.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { User, LoginRequest } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          authService.logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (request: LoginRequest) => {
    try {
      const response = await authService.login(request);
      const userData: User = {
        id: response.userId,
        email: response.email,
        name: response.name,
        role: response.role,
      };
      setUser(userData);
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${userData.name}`,
      });

      // Redirect based on role
      if (userData.role === "ADMIN") {
        router.push("/admin/packages");
      } else {
        router.push("/seller/packages");
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Invalid credentials";
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  }, [router, toast]);

  const logout = useCallback(() => {
    setUser(null);
    authService.logout();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    isSeller: user?.role === "SELLER",
    login,
    logout,
  };
}

## File 2: src/app/providers.tsx

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}

## File 3: src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlueLogistic - Package Management",
  description: "Package management platform for logistics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

## File 4: src/app/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const user = await authService.getCurrentUser();
        if (user.role === "ADMIN") {
          router.push("/admin/packages");
        } else {
          router.push("/seller/packages");
        }
      } catch {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

## File 5: src/components/forms/LoginForm.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
    } catch (error) {
      // Error handled in useAuth
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-brand-orange hover:bg-brand-orange/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
}

## File 6: src/app/(auth)/login/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/LoginForm";
import { authService } from "@/services";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect
    const user = authService.getStoredUser();
    if (user) {
      router.push(user.role === "ADMIN" ? "/admin/packages" : "/seller/packages");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-xl bg-brand-blue flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-brand-blue">BlueLogistic</h1>
          <p className="text-muted-foreground">Package Management Platform</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          © 2025 BlueLogistic. All rights reserved.
        </p>
      </div>
    </div>
  );
}

Create all these files. The login page should now work. Test by running npm run dev and visiting http://localhost:3000/login
```

---

# PROMPT 4: Dashboard Layout & Navigation

```
Create the dashboard layout with sidebar navigation for BlueLogistic.

Working directory: blue-logistic-frontend/src/

## File 1: src/components/layout/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Users, PlusCircle, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminNavItems: NavItem[] = [
  { label: "Packages", href: "/admin/packages", icon: Package },
  { label: "Sellers", href: "/admin/sellers", icon: Users },
];

const sellerNavItems: NavItem[] = [
  { label: "My Packages", href: "/seller/packages", icon: Package },
  { label: "New Package", href: "/seller/packages/new", icon: PlusCircle },
];

function NavLinks({ items, onItemClick }: { items: NavItem[]; onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-orange text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const { user, logout, isAdmin } = useAuth();
  const navItems = isAdmin ? adminNavItems : sellerNavItems;

  return (
    <div className="flex flex-col h-full bg-brand-blue">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white">BlueLogistic</h1>
          <p className="text-xs text-white/60">{user?.role}</p>
        </div>
      </div>

      {/* Navigation */}
      <NavLinks items={navItems} onItemClick={onItemClick} />

      {/* User & Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
          <p className="text-xs text-white/60 truncate">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <SidebarContent onItemClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

## File 2: src/components/layout/Header.tsx

"use client";

import { useAuth } from "@/hooks/useAuth";
import { MobileSidebar } from "./Sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <MobileSidebar />
          <h1 className="text-xl font-semibold text-brand-blue">{title}</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
              <Avatar className="h-9 w-9 bg-brand-blue">
                <AvatarFallback className="bg-brand-blue text-white text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

## File 3: src/components/layout/PageHeader.tsx

import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function PageHeader({
  title,
  description,
  backHref,
  actionLabel,
  actionHref,
  onAction,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        {backHref && (
          <Link href={backHref}>
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        )}
        <div>
          <h2 className="text-2xl font-bold text-brand-blue">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>

      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link href={actionHref}>
            <Button className="bg-brand-orange hover:bg-brand-orange/90">
              <Plus className="h-4 w-4 mr-2" />
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button
            onClick={onAction}
            className="bg-brand-orange hover:bg-brand-orange/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}

## File 4: src/app/(dashboard)/layout.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { Sidebar } from "@/components/layout/Sidebar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        await authService.getCurrentUser();
        setIsAuthenticated(true);
      } catch {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="lg:pl-64">
        {children}
      </main>
    </div>
  );
}

Now the dashboard layout is ready. The sidebar navigation will automatically show different items based on user role.
```

---

# PROMPT 5: React Query Hooks

```
Create React Query hooks for data fetching in BlueLogistic frontend.

Working directory: blue-logistic-frontend/src/

## File 1: src/hooks/usePackages.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packageService } from "@/services";
import { CreatePackageRequest, UpdateStatusRequest, UpdateTrackingRequest } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function usePackages(page = 0, size = 20) {
  return useQuery({
    queryKey: ["packages", page, size],
    queryFn: () => packageService.getPackages(page, size),
  });
}

export function usePackage(id: string) {
  return useQuery({
    queryKey: ["package", id],
    queryFn: () => packageService.getPackageById(id),
    enabled: !!id,
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: CreatePackageRequest) => packageService.createPackage(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast({
        title: "Package created",
        description: "The package has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create package",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateStatusRequest }) =>
      packageService.updateStatus(id, request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["package", data.id] });
      toast({
        title: "Status updated",
        description: `Package status changed to ${data.status.replace("_", " ")}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update status",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTracking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateTrackingRequest }) =>
      packageService.updateTracking(id, request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["package", data.id] });
      toast({
        title: "Tracking added",
        description: "Tracking number has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to add tracking",
        variant: "destructive",
      });
    },
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => packageService.deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast({
        title: "Package deleted",
        description: "The package has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete package",
        variant: "destructive",
      });
    },
  });
}

## File 2: src/hooks/useSellers.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sellerService } from "@/services";
import { CreateSellerRequest, UpdateSellerStatusRequest } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function useSellers(page = 0, size = 20) {
  return useQuery({
    queryKey: ["sellers", page, size],
    queryFn: () => sellerService.getSellers(page, size),
  });
}

export function useSeller(id: string) {
  return useQuery({
    queryKey: ["seller", id],
    queryFn: () => sellerService.getSellerById(id),
    enabled: !!id,
  });
}

export function useCreateSeller() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: CreateSellerRequest) => sellerService.createSeller(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      toast({
        title: "Seller created",
        description: "The seller account has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create seller",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateSellerStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateSellerStatusRequest }) =>
      sellerService.updateSellerStatus(id, request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      queryClient.invalidateQueries({ queryKey: ["seller", data.id] });
      toast({
        title: "Status updated",
        description: `Seller is now ${data.isActive ? "active" : "inactive"}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update seller status",
        variant: "destructive",
      });
    },
  });
}

## File 3: src/hooks/useDebounce.ts

import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

## File 4: src/hooks/index.ts

export { useAuth } from "./useAuth";
export { usePackages, usePackage, useCreatePackage, useUpdateStatus, useUpdateTracking, useDeletePackage } from "./usePackages";
export { useSellers, useSeller, useCreateSeller, useUpdateSellerStatus } from "./useSellers";
export { useDebounce } from "./useDebounce";

These hooks handle all API interactions with automatic cache invalidation and toast notifications.
```

---

# PROMPT 6: Package Components & Seller Package Pages

```
Create package-related components and seller package pages.

Working directory: blue-logistic-frontend/src/

## File 1: src/components/packages/StatusBadge.tsx

import { Badge } from "@/components/ui/badge";
import { PackageStatus } from "@/types";
import { getStatusLabel, getStatusColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: PackageStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(getStatusColor(status), className)}>
      {getStatusLabel(status)}
    </Badge>
  );
}

## File 2: src/components/packages/PackageCard.tsx

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Package } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { formatDate, formatWeight } from "@/lib/utils";
import { MapPin, Phone, Mail, Scale } from "lucide-react";
import Link from "next/link";

interface PackageCardProps {
  pkg: Package;
  href: string;
}

export function PackageCard({ pkg, href }: PackageCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{pkg.customerName}</p>
              <p className="text-sm text-muted-foreground truncate">{pkg.description}</p>
            </div>
            <StatusBadge status={pkg.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Scale className="h-4 w-4 shrink-0" />
            <span>{formatWeight(pkg.weight)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{pkg.deliveryAddress}</span>
          </div>
          {pkg.trackingNumber && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">Tracking</p>
              <p className="font-mono text-sm">{pkg.trackingNumber}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground pt-2">
            Created {formatDate(pkg.createdAt)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

## File 3: src/components/forms/PackageForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createPackageSchema, CreatePackageFormData } from "@/lib/validations";

interface PackageFormProps {
  onSubmit: (data: CreatePackageFormData) => void;
  isLoading?: boolean;
}

export function PackageForm({ onSubmit, isLoading = false }: PackageFormProps) {
  const form = useForm<CreatePackageFormData>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      description: "",
      weight: 0,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      deliveryAddress: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+355 123 456 789" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="1.5"
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deliveryAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Street, City, Postal Code"
                  rows={2}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the package contents"
                  rows={3}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full md:w-auto bg-brand-orange hover:bg-brand-orange/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Package"
          )}
        </Button>
      </form>
    </Form>
  );
}

## File 4: src/app/(dashboard)/seller/packages/page.tsx

"use client";

import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { PackageCard } from "@/components/packages/PackageCard";
import { usePackages } from "@/hooks/usePackages";
import { Skeleton } from "@/components/ui/skeleton";
import { Package as PackageIcon } from "lucide-react";

export default function SellerPackagesPage() {
  const { data, isLoading } = usePackages();

  return (
    <>
      <Header title="My Packages" />
      <div className="p-4 sm:p-6">
        <PageHeader
          title="My Packages"
          description="View and manage your packages"
          actionLabel="New Package"
          actionHref="/seller/packages/new"
        />

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : data?.content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <PackageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No packages yet</h3>
            <p className="text-muted-foreground mt-1">
              Create your first package to get started
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.content.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                href={`/seller/packages/${pkg.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

## File 5: src/app/(dashboard)/seller/packages/new/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { PackageForm } from "@/components/forms/PackageForm";
import { useCreatePackage } from "@/hooks/usePackages";
import { Card, CardContent } from "@/components/ui/card";
import { CreatePackageFormData } from "@/lib/validations";

export default function NewPackagePage() {
  const router = useRouter();
  const { mutate: createPackage, isPending } = useCreatePackage();

  const handleSubmit = (data: CreatePackageFormData) => {
    createPackage(data, {
      onSuccess: () => {
        router.push("/seller/packages");
      },
    });
  };

  return (
    <>
      <Header title="New Package" />
      <div className="p-4 sm:p-6">
        <PageHeader
          title="Create New Package"
          description="Enter the package and customer details"
          backHref="/seller/packages"
        />

        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <PackageForm onSubmit={handleSubmit} isLoading={isPending} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

## File 6: src/app/(dashboard)/seller/packages/[id]/page.tsx

"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/packages/StatusBadge";
import { usePackage } from "@/hooks/usePackages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatWeight } from "@/lib/utils";
import { MapPin, Phone, Mail, Scale, Calendar, Truck } from "lucide-react";

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pkg, isLoading } = usePackage(id);

  if (isLoading) {
    return (
      <>
        <Header title="Package Details" />
        <div className="p-4 sm:p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full max-w-2xl" />
        </div>
      </>
    );
  }

  if (!pkg) {
    return (
      <>
        <Header title="Package Details" />
        <div className="p-4 sm:p-6">
          <p>Package not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Package Details" />
      <div className="p-4 sm:p-6">
        <PageHeader
          title={`Package for ${pkg.customerName}`}
          backHref="/seller/packages"
        />

        <div className="grid gap-6 max-w-2xl">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Status</CardTitle>
                <StatusBadge status={pkg.status} />
              </div>
            </CardHeader>
            <CardContent>
              {pkg.trackingNumber ? (
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-brand-orange" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-mono font-semibold">{pkg.trackingNumber}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Tracking number will appear when package is dispatched</p>
              )}
            </CardContent>
          </Card>

          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">{pkg.customerName}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{pkg.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{pkg.customerPhone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>{pkg.deliveryAddress}</span>
              </div>
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Package Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{pkg.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-muted-foreground" />
                <span>{formatWeight(pkg.weight)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDate(pkg.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

The seller dashboard is now complete. Test by logging in with john@shop.com / seller123
```

---

# PROMPT 7: Admin Package Pages

```
Create admin package management pages.

Working directory: blue-logistic-frontend/src/

## File 1: src/components/forms/StatusUpdateForm.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PackageStatus } from "@/types";
import { STATUS_NEXT } from "@/lib/constants";
import { getStatusLabel } from "@/lib/utils";
import { Loader2, ArrowRight } from "lucide-react";

interface StatusUpdateFormProps {
  currentStatus: PackageStatus;
  onUpdate: (newStatus: PackageStatus) => void;
  isLoading?: boolean;
}

export function StatusUpdateForm({ currentStatus, onUpdate, isLoading }: StatusUpdateFormProps) {
  const nextStatus = STATUS_NEXT[currentStatus];

  if (!nextStatus) {
    return (
      <p className="text-sm text-muted-foreground">
        This package has reached its final status.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{getStatusLabel(currentStatus)}</span>
        <ArrowRight className="h-4 w-4" />
        <span className="font-medium">{getStatusLabel(nextStatus)}</span>
      </div>
      <Button
        onClick={() => onUpdate(nextStatus)}
        disabled={isLoading}
        className="bg-brand-blue hover:bg-brand-blue/90"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          `Mark as ${getStatusLabel(nextStatus)}`
        )}
      </Button>
    </div>
  );
}

## File 2: src/components/forms/TrackingForm.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface TrackingFormProps {
  onSubmit: (trackingNumber: string) => void;
  isLoading?: boolean;
}

export function TrackingForm({ onSubmit, isLoading }: TrackingFormProps) {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      onSubmit(trackingNumber.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="tracking">Tracking Number</Label>
        <Input
          id="tracking"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter tracking number"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Adding tracking will automatically mark the package as Dispatched
        </p>
      </div>
      <Button
        type="submit"
        disabled={isLoading || !trackingNumber.trim()}
        className="bg-brand-orange hover:bg-brand-orange/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          "Add Tracking"
        )}
      </Button>
    </form>
  );
}

## File 3: src/app/(dashboard)/admin/packages/page.tsx

"use client";

import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/packages/StatusBadge";
import { usePackages } from "@/hooks/usePackages";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatWeight } from "@/lib/utils";
import Link from "next/link";
import { Package as PackageIcon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPackagesPage() {
  const { data, isLoading } = usePackages();

  return (
    <>
      <Header title="All Packages" />
      <div className="p-4 sm:p-6">
        <PageHeader
          title="All Packages"
          description="Manage all packages across sellers"
        />

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : data?.content.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <PackageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No packages found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tracking</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.content.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.customerName}</TableCell>
                      <TableCell>{pkg.sellerName}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{pkg.description}</TableCell>
                      <TableCell>{formatWeight(pkg.weight)}</TableCell>
                      <TableCell>
                        <StatusBadge status={pkg.status} />
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {pkg.trackingNumber || "-"}
                      </TableCell>
                      <TableCell>{formatDate(pkg.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/packages/${pkg.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

## File 4: src/app/(dashboard)/admin/packages/[id]/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/packages/StatusBadge";
import { StatusUpdateForm } from "@/components/forms/StatusUpdateForm";
import { TrackingForm } from "@/components/forms/TrackingForm";
import { usePackage, useUpdateStatus, useUpdateTracking, useDeletePackage } from "@/hooks/usePackages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDate, formatWeight } from "@/lib/utils";
import { MapPin, Phone, Mail, Scale, Calendar, Store, Trash2, Truck } from "lucide-react";
import { PackageStatus } from "@/types";

export default function AdminPackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: pkg, isLoading } = usePackage(id);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateStatus();
  const { mutate: updateTracking, isPending: isUpdatingTracking } = useUpdateTracking();
  const { mutate: deletePackage, isPending: isDeleting } = useDeletePackage();

  const handleStatusUpdate = (newStatus: PackageStatus) => {
    updateStatus({ id, request: { status: newStatus } });
  };

  const handleTrackingUpdate = (trackingNumber: string) => {
    updateTracking({ id, request: { trackingNumber } });
  };

  const handleDelete = () => {
    deletePackage(id, {
      onSuccess: () => router.push("/admin/packages"),
    });
  };

  if (isLoading) {
    return (
      <>
        <Header title="Package Details" />
        <div className="p-4 sm:p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </>
    );
  }

  if (!pkg) {
    return (
      <>
        <Header title="Package Details" />
        <div className="p-4 sm:p-6">
          <p>Package not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Package Details" />
      <div className="p-4 sm:p-6">
        <PageHeader
          title={`Package for ${pkg.customerName}`}
          backHref="/admin/packages"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Status & Actions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Status</CardTitle>
                  <StatusBadge status={pkg.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <StatusUpdateForm
                  currentStatus={pkg.status}
                  onUpdate={handleStatusUpdate}
                  isLoading={isUpdatingStatus}
                />

                {!pkg.trackingNumber && pkg.status !== "CREATED" && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-4">Add Tracking Number</h4>
                    <TrackingForm onSubmit={handleTrackingUpdate} isLoading={isUpdatingTracking} />
                  </div>
                )}

                {pkg.trackingNumber && (
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Truck className="h-5 w-5 text-brand-orange" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-mono font-semibold">{pkg.trackingNumber}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{pkg.sellerName}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-semibold">{pkg.customerName}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{pkg.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{pkg.customerPhone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{pkg.deliveryAddress}</span>
                </div>
              </CardContent>
            </Card>

            {/* Package Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Package Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{pkg.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <span>{formatWeight(pkg.weight)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Created {formatDate(pkg.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Delete */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Package
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Package</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the package.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

Admin can now view all packages, update status, add tracking, and delete packages.
```

---

# PROMPT 8: Admin Seller Pages

```
Create admin seller management pages.

Working directory: blue-logistic-frontend/src/

## File 1: src/components/forms/SellerForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createSellerSchema, CreateSellerFormData } from "@/lib/validations";

interface SellerFormProps {
  onSubmit: (data: CreateSellerFormData) => void;
  isLoading?: boolean;
}

export function SellerForm({ onSubmit, isLoading = false }: SellerFormProps) {
  const form = useForm<CreateSellerFormData>({
    resolver: zodResolver(createSellerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      companyName: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Corp" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@acme.com"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Min 8 characters"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full md:w-auto bg-brand-orange hover:bg-brand-orange/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Seller"
          )}
        </Button>
      </form>
    </Form>
  );
}

## File 2: src/app/(dashboard)/admin/sellers/page.tsx

"use client";

import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { useSellers, useUpdateSellerStatus } from "@/hooks/useSellers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Users, Eye, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminSellersPage() {
  const { data, isLoading } = useSellers();
  const { mutate: updateStatus, isPending } = useUpdateSellerStatus();

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateStatus({ id, request: { isActive: !currentStatus } });
  };

  return (
    <>
      <Header title="Sellers" />
      <div className="p-4 sm:p-6">
        <PageHeader
          title="Sellers"
          description="Manage seller accounts"
          actionLabel="Add Seller"
          actionHref="/admin/sellers/new"
        />

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : data?.content.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No sellers yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.content.map((seller) => (
                    <TableRow key={seller.id}>
                      <TableCell className="font-medium">{seller.companyName}</TableCell>
                      <TableCell>{seller.name}</TableCell>
                      <TableCell>{seller.email}</TableCell>
                      <TableCell>
                        <Badge variant={seller.isActive ? "default" : "secondary"}>
                          {seller.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(seller.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(seller.id, seller.isActive)}
                            disabled={isPending}
                          >
                            {seller.isActive ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Link href={`/admin/sellers/${seller.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

## File 3: src/app/(dashboard)/admin/sellers/new/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SellerForm } from "@/components/forms/SellerForm";
import { useCreateSeller } from "@/hooks/useSellers";
import { Card, CardContent } from "@/components/ui/card";
import { CreateSellerFormData } from "@/lib/validations";

export default function NewSellerPage() {
  const router = useRouter();
  const { mutate: createSeller, isPending } = useCreateSeller();

  const handleSubmit = (data: CreateSellerFormData) => {
    createSeller(data, {
      onSuccess: () => {
        router.push("/admin/sellers");
      },
    });
  };

  return (
    <>
      <Header title="Add Seller" />
      <div className="p-4 sm:p-6">
        <PageHeader
          title="Add New Seller"
          description="Create a new seller account"
          backHref="/admin/sellers"
        />

        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <SellerForm onSubmit={handleSubmit} isLoading={isPending} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

## File 4: src/app/(dashboard)/admin/sellers/[id]/page.tsx

"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/packages/StatusBadge";
import { useSeller, useUpdateSellerStatus } from "@/hooks/useSellers";
import { usePackages } from "@/hooks/usePackages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatWeight } from "@/lib/utils";
import Link from "next/link";
import { Building, Mail, Calendar, Eye } from "lucide-react";

export default function SellerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: seller, isLoading: isLoadingSeller } = useSeller(id);
  const { data: packages, isLoading: isLoadingPackages } = usePackages();
  const { mutate: updateStatus, isPending } = useUpdateSellerStatus();

  const sellerPackages = packages?.content.filter((p) => p.sellerId === id) || [];

  const handleToggleStatus = () => {
    if (seller) {
      updateStatus({ id, request: { isActive: !seller.isActive } });
    }
  };

  if (isLoadingSeller) {
    return (
      <>
        <Header title="Seller Details" />
        <div className="p-4 sm:p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64" />
        </div>
      </>
    );
  }

  if (!seller) {
    return (
      <>
        <Header title="Seller Details" />
        <div className="p-4 sm:p-6">
          <p>Seller not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Seller Details" />
      <div className="p-4 sm:p-6">
        <PageHeader title={seller.companyName} backHref="/admin/sellers" />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Seller Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Seller Info</CardTitle>
                <Badge variant={seller.isActive ? "default" : "secondary"}>
                  {seller.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{seller.companyName}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{seller.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{seller.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(seller.createdAt)}</span>
              </div>
              <div className="pt-4 border-t">
                <Button
                  variant={seller.isActive ? "destructive" : "default"}
                  onClick={handleToggleStatus}
                  disabled={isPending}
                  className="w-full"
                >
                  {seller.isActive ? "Deactivate Seller" : "Activate Seller"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Seller Packages */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">
                Packages ({sellerPackages.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingPackages ? (
                <div className="p-6">
                  <Skeleton className="h-24" />
                </div>
              ) : sellerPackages.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No packages from this seller yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sellerPackages.slice(0, 10).map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.customerName}</TableCell>
                        <TableCell>{formatWeight(pkg.weight)}</TableCell>
                        <TableCell>
                          <StatusBadge status={pkg.status} />
                        </TableCell>
                        <TableCell>{formatDate(pkg.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/packages/${pkg.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

The admin seller management is complete. Test with admin@bluelogistic.com / password

## FINAL CHECKLIST

Run the frontend:
cd blue-logistic-frontend
npm run dev

Test all features:
1. Login as admin → see all packages and sellers
2. Login as seller → see own packages only
3. Create new package as seller
4. Update package status as admin
5. Add tracking number as admin
6. Create new seller as admin
7. Toggle seller active/inactive as admin

All done! The frontend is complete.
```

---

# Summary: Execution Order

| Step | Prompt | What It Creates |
|------|--------|-----------------|
| 1 | PROMPT 1 | Project setup, dependencies, folder structure, brand colors |
| 2 | PROMPT 2 | TypeScript types, API services, utilities, validations |
| 3 | PROMPT 3 | Authentication (login page, auth hook, providers) |
| 4 | PROMPT 4 | Dashboard layout (sidebar, header, page header) |
| 5 | PROMPT 5 | React Query hooks for data fetching |
| 6 | PROMPT 6 | Seller pages (package list, create, view) |
| 7 | PROMPT 7 | Admin package pages (list, detail with status/tracking) |
| 8 | PROMPT 8 | Admin seller pages (list, create, detail) |

**Execute prompts in order. Run `npm run dev` after each to verify.**
