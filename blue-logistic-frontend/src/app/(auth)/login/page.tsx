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
