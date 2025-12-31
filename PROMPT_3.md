# PROMPT 3: Authentication System

Working directory: ~/BlueLogistic/blue-logistic-frontend/src/

## File 1: src/hooks/useAuth.ts

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { User, LoginRequest } from "@/types";
import { toast } from "sonner";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
      
      toast.success(`Welcome back, ${userData.name}!`);

      if (userData.role === "ADMIN") {
        router.push("/admin/packages");
      } else {
        router.push("/seller/packages");
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Invalid credentials";
      toast.error(message);
      throw error;
    }
  }, [router]);

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
```

## File 2: src/app/providers.tsx

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
```

## File 3: src/app/layout.tsx (REPLACE EXISTING)

```typescript
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
```

## File 4: src/app/page.tsx (REPLACE EXISTING)

```typescript
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        <p className="text-slate-500">Loading...</p>
      </div>
    </div>
  );
}
```

## File 5: src/components/forms/LoginForm.tsx

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
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
                <Input type="email" placeholder="Enter your email" autoComplete="email" disabled={isLoading} {...field} />
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
                <Input type="password" placeholder="Enter your password" autoComplete="current-password" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-brand-orange hover:opacity-90" disabled={isLoading}>
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
```

## File 6: src/app/(auth)/login/page.tsx

```typescript
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
    const user = authService.getStoredUser();
    if (user) {
      router.push(user.role === "ADMIN" ? "/admin/packages" : "/seller/packages");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-xl bg-brand-blue flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-brand-blue">BlueLogistic</h1>
          <p className="text-slate-500">Package Management Platform</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-6">
          © 2025 BlueLogistic. All rights reserved.
        </p>
      </div>
    </div>
  );
}
```

---

After creating all files, test by running `npm run dev` and visiting http://localhost:3000/login

Test credentials:
- Admin: admin@bluelogistic.com / password
- Seller: john@shop.com / seller123
