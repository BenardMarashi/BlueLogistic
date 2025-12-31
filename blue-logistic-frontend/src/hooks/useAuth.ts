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
