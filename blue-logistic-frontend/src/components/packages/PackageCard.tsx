import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Package } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { formatDate, formatWeight } from "@/lib/utils";
import { MapPin, Scale, Truck } from "lucide-react";
import Link from "next/link";

interface PackageCardProps {
  pkg: Package;
  href: string;
}

export function PackageCard({ pkg, href }: PackageCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="bg-white hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200 hover:border-[#D8420E]/30 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 truncate group-hover:text-[#0D2556] transition-colors">{pkg.customerName}</p>
              <p className="text-sm text-slate-600 truncate mt-1">{pkg.description}</p>
            </div>
            <StatusBadge status={pkg.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Scale className="h-4 w-4 shrink-0 text-[#0D2556]" />
            <span className="font-medium">{formatWeight(pkg.weight)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="h-4 w-4 shrink-0 text-[#0D2556]" />
            <span className="truncate">{pkg.deliveryAddress}</span>
          </div>
          {pkg.trackingNumber && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2">
                <Truck className="h-4 w-4 text-[#D8420E]" />
                <span className="font-mono text-sm font-semibold text-[#D8420E]">{pkg.trackingNumber}</span>
              </div>
            </div>
          )}
          <p className="text-xs text-slate-400 pt-2">Created {formatDate(pkg.createdAt)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
