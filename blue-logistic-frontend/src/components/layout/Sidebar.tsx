"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Users, PlusCircle, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "@/hooks/useLocale";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminNavItems: NavItem[] = [
  { labelKey: "packages", href: "/admin/packages", icon: Package },
  { labelKey: "allSellers", href: "/admin/sellers", icon: Users },
];

const sellerNavItems: NavItem[] = [
  { labelKey: "myPackages", href: "/seller/packages", icon: Package },
  { labelKey: "newPackage", href: "/seller/packages/new", icon: PlusCircle },
];

function NavLinks({ items, onItemClick }: { items: NavItem[]; onItemClick?: () => void }) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <nav className="flex-1 px-4 py-6 space-y-2">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-[#D8420E] text-white shadow-lg shadow-orange-500/30"
                : "text-white/90 hover:bg-white/10 hover:text-white hover:shadow-md"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const { user, logout, isAdmin } = useAuth();
  const t = useTranslations("nav");
  const navItems = isAdmin ? adminNavItems : sellerNavItems;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0D2556] to-[#091A3D] shadow-2xl">
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D8420E] to-[#B8380C] flex items-center justify-center shadow-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">BlueLogistic</h1>
            <p className="text-xs text-white/60 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <NavLinks items={navItems} onItemClick={onItemClick} />

      {/* User Section */}
      <div className="px-4 py-6 border-t border-white/10 mt-auto">
        <div className="bg-white/5 rounded-xl px-4 py-3 mb-3">
          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
          <p className="text-xs text-white/60 truncate">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-white/80 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-all rounded-lg"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          {t("logout")}
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden hover:bg-slate-100">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 border-0">
        <SidebarContent onItemClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
