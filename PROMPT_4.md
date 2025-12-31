# PROMPT 4: Dashboard Layout & Navigation

Working directory: ~/BlueLogistic/blue-logistic-frontend/src/

## File 1: src/components/layout/Sidebar.tsx

```typescript
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
              isActive ? "bg-brand-orange text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
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
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white">BlueLogistic</h1>
          <p className="text-xs text-white/60">{user?.role}</p>
        </div>
      </div>

      <NavLinks items={navItems} onItemClick={onItemClick} />

      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
          <p className="text-xs text-white/60 truncate">{user?.email}</p>
        </div>
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10" onClick={logout}>
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
```

## File 2: src/components/layout/Header.tsx

```typescript
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

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

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
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <Avatar className="h-9 w-9 bg-brand-blue">
                <AvatarFallback className="bg-brand-blue text-white text-sm">{initials}</AvatarFallback>
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
```

## File 3: src/components/layout/PageHeader.tsx

```typescript
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

export function PageHeader({ title, description, backHref, actionLabel, actionHref, onAction }: PageHeaderProps) {
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
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
      </div>

      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link href={actionHref}>
            <Button className="bg-brand-orange hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onAction} className="bg-brand-orange hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
```

## File 4: src/app/(dashboard)/layout.tsx

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { Sidebar } from "@/components/layout/Sidebar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
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
      <main className="lg:pl-64">{children}</main>
    </div>
  );
}
```

---

After creating all files, test by logging in and verifying the sidebar appears correctly.
