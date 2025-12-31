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
