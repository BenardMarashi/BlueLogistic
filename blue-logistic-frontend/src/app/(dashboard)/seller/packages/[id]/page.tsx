"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/packages/StatusBadge";
import { usePackage } from "@/hooks/usePackages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatWeight, formatPrice, getCountryName } from "@/lib/utils";
import { MapPin, Phone, Mail, Scale, Calendar, Truck, Globe, Euro } from "lucide-react";

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pkg, isLoading } = usePackage(id);

  if (isLoading) {
    return (
      <>
        <Header title="Package Details" />
        <div className="p-4 sm:p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full max-w-2xl" />
        </div>
      </>
    );
  }

  if (!pkg) {
    return (
      <>
        <Header title="Package Details" />
        <div className="p-4 sm:p-6"><p>Package not found</p></div>
      </>
    );
  }

  return (
    <>
      <Header title="Package Details" />
      <div className="p-4 sm:p-6">
        <PageHeader title={`Package for ${pkg.customerName}`} backHref="/seller/packages" />

        <div className="grid gap-6 max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Status</CardTitle>
                <StatusBadge status={pkg.status} />
              </div>
            </CardHeader>
            <CardContent>
              {pkg.trackingNumber ? (
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-brand-orange" />
                  <div>
                    <p className="text-sm text-slate-500">Tracking Number</p>
                    <p className="font-mono font-semibold">{pkg.trackingNumber}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">Tracking number will appear when package is dispatched</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Customer Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="font-semibold">{pkg.customerName}</p>
              <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-slate-400" /><span>{pkg.customerEmail}</span></div>
              <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-slate-400" /><span>{pkg.customerPhone}</span></div>
              <div className="flex items-start gap-2 text-sm"><MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" /><span>{pkg.deliveryAddress}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Package Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-sm text-slate-500">Description</p><p>{pkg.description}</p></div>
              <div className="flex items-center gap-2"><Scale className="h-4 w-4 text-slate-400" /><span>{formatWeight(pkg.weight)}</span></div>
              <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-slate-400" /><span>Destination: {getCountryName(pkg.destinationCountry)}</span></div>
              <div className="flex items-center gap-2 text-sm text-slate-500"><Calendar className="h-4 w-4" /><span>Created {formatDate(pkg.createdAt)}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Pricing</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-[#D8420E]" />
                <span className="text-2xl font-bold text-[#D8420E]">{formatPrice(pkg.sellerPrice)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
