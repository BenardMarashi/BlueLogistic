"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/LoginForm";
import { authService } from "@/services";
import { useTranslations } from "@/hooks/useLocale";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth");

  useEffect(() => {
    const user = authService.getStoredUser();
    if (user) {
      router.push(user.role === "ADMIN" ? "/admin/packages" : "/seller/packages");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D2556] via-[#091A3D] to-[#0D2556] px-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#D8420E] to-[#B8380C] flex items-center justify-center mb-6 shadow-2xl shadow-orange-500/30">
            <Package className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">BlueLogistic</h1>
          <p className="text-white/70 text-lg">{t("platformDescription")}</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-[#0D2556]">{t("welcomeBack")}</CardTitle>
            <CardDescription className="text-slate-600">{t("signInToAccount")}</CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <LoginForm />
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-white/60 mt-8">
          © 2025 BlueLogistic. All rights reserved.
        </p>
      </div>
    </div>
  );
}
