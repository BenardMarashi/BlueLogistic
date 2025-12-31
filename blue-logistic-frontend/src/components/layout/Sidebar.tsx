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
