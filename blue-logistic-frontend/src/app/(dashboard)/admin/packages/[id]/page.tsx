"use client";

import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/packages/StatusBadge";
import { StatusUpdateForm } from "@/components/forms/StatusUpdateForm";
import { TrackingForm } from "@/components/forms/TrackingForm";
import { usePackage, useUpdateStatus, useUpdateTracking, useDeletePackage } from "@/hooks/usePackages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatDate, formatWeight, formatPrice } from "@/lib/utils";
import { MapPin, Phone, Mail, Scale, Calendar, Store, Trash2, Truck, Globe, Euro } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PackageStatus } from "@/types";
import { useTranslations } from "@/hooks/useLocale";

export default function AdminPackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: pkg, isLoading } = usePackage(id);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateStatus();
  const { mutate: updateTracking, isPending: isUpdatingTracking } = useUpdateTracking();
  const { mutate: deletePackage, isPending: isDeleting } = useDeletePackage();

  const t = useTranslations("packages");
  const ts = useTranslations("status");
  const tt = useTranslations("tracking");
  const tp = useTranslations("pricing");
  const tc = useTranslations("countries");
  const td = useTranslations("danger");
  const tco = useTranslations("common");

  const handleStatusUpdate = (newStatus: PackageStatus) => {
    updateStatus({ id, request: { status: newStatus } });
  };

  const handleTrackingUpdate = (trackingNumber: string) => {
    updateTracking({ id, request: { trackingNumber } });
  };

  const handleDelete = () => {
    deletePackage(id, { onSuccess: () => router.push("/admin/packages") });
  };

  if (isLoading) {
    return (
      <>
        <Header title={t("packageDetails")} />
        <div className="p-4 sm:p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>
        </div>
      </>
    );
  }

  if (!pkg) {
    return (<><Header title={t("packageDetails")} /><div className="p-4 sm:p-6"><p>Package not found</p></div></>);
  }

  return (
    <>
      <Header title={t("packageDetails")} />
      <div className="p-4 sm:p-6">
        <PageHeader title={t("packageFor", { name: pkg.customerName })} backHref="/admin/packages" />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{ts("status")}</CardTitle>
                  <StatusBadge status={pkg.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <StatusUpdateForm currentStatus={pkg.status} onUpdate={handleStatusUpdate} isLoading={isUpdatingStatus} />

                {!pkg.trackingNumber && pkg.status !== "CREATED" && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-4">{tt("addTracking")}</h4>
                    <TrackingForm onSubmit={handleTrackingUpdate} isLoading={isUpdatingTracking} />
                  </div>
                )}

                {pkg.trackingNumber && (
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Truck className="h-5 w-5 text-brand-orange" />
                    <div><p className="text-sm text-slate-500">{tt("trackingNumber")}</p><p className="font-mono font-semibold">{pkg.trackingNumber}</p></div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">{t("seller")}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-2"><Store className="h-4 w-4 text-slate-400" /><span className="font-medium">{pkg.sellerName}</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">{tp("pricingDetails")}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t("destination")}:</span>
                  <span className="font-medium">{tc(pkg.destinationCountry)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t("weight")}:</span>
                  <span className="font-medium">{formatWeight(pkg.weight)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-slate-500">{tp("costPrice")}:</span>
                  <span className="font-medium">{formatPrice(pkg.costPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{tp("sellerPrice")}:</span>
                  <span className="font-bold text-[#D8420E]">{formatPrice(pkg.sellerPrice)}</span>
                </div>
                {pkg.priceBreakdown && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{tp("calculation")}:</span>
                    <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{pkg.priceBreakdown}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">{t("customer")}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="font-semibold">{pkg.customerName}</p>
                <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-slate-400" /><span>{pkg.customerEmail}</span></div>
                <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-slate-400" /><span>{pkg.customerPhone}</span></div>
                <div className="flex items-start gap-2 text-sm"><MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" /><span>{pkg.deliveryAddress}</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">{t("packageDetails")}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><p className="text-sm text-slate-500">{t("description")}</p><p>{pkg.description}</p></div>
                <div className="flex items-center gap-2"><Scale className="h-4 w-4 text-slate-400" /><span>{formatWeight(pkg.weight)}</span></div>
                <div className="flex items-center gap-2 text-sm text-slate-500"><Calendar className="h-4 w-4" /><span>{t("created")} {formatDate(pkg.createdAt)}</span></div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader><CardTitle className="text-lg text-red-600">{td("dangerZone")}</CardTitle></CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}><Trash2 className="h-4 w-4 mr-2" />{td("deletePackage")}</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{td("deletePackage")}</AlertDialogTitle>
                      <AlertDialogDescription>{tco("cannotBeUndone")}. {td("deletePackageConfirm")}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{tco("cancel")}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">{tco("delete")}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
