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
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{pkg.customerName}</p>
              <p className="text-sm text-slate-500 truncate">{pkg.description}</p>
            </div>
            <StatusBadge status={pkg.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <Scale className="h-4 w-4 shrink-0" />
            <span>{formatWeight(pkg.weight)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{pkg.deliveryAddress}</span>
          </div>
          {pkg.trackingNumber && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-brand-orange" />
                <span className="font-mono text-sm">{pkg.trackingNumber}</span>
              </div>
            </div>
          )}
          <p className="text-xs text-slate-400 pt-2">Created {formatDate(pkg.createdAt)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
