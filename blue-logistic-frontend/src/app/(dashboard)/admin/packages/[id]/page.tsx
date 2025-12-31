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
import { formatDate, formatWeight } from "@/lib/utils";
import { MapPin, Phone, Mail, Scale, Calendar, Store, Trash2, Truck } from "lucide-react";
import { PackageStatus } from "@/types";

export default function AdminPackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: pkg, isLoading } = usePackage(id);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateStatus();
  const { mutate: updateTracking, isPending: isUpdatingTracking } = useUpdateTracking();
  const { mutate: deletePackage, isPending: isDeleting } = useDeletePackage();

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
        <Header title="Package Details" />
        <div className="p-4 sm:p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>
        </div>
      </>
    );
  }

  if (!pkg) {
    return (<><Header title="Package Details" /><div className="p-4 sm:p-6"><p>Package not found</p></div></>);
  }

  return (
    <>
      <Header title="Package Details" />
      <div className="p-4 sm:p-6">
        <PageHeader title={`Package for ${pkg.customerName}`} backHref="/admin/packages" />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Status</CardTitle>
                  <StatusBadge status={pkg.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <StatusUpdateForm currentStatus={pkg.status} onUpdate={handleStatusUpdate} isLoading={isUpdatingStatus} />

                {!pkg.trackingNumber && pkg.status !== "CREATED" && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-4">Add Tracking Number</h4>
                    <TrackingForm onSubmit={handleTrackingUpdate} isLoading={isUpdatingTracking} />
                  </div>
                )}

                {pkg.trackingNumber && (
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Truck className="h-5 w-5 text-brand-orange" />
                    <div><p className="text-sm text-slate-500">Tracking Number</p><p className="font-mono font-semibold">{pkg.trackingNumber}</p></div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Seller</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-2"><Store className="h-4 w-4 text-slate-400" /><span className="font-medium">{pkg.sellerName}</span></div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
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
                <div className="flex items-center gap-2 text-sm text-slate-500"><Calendar className="h-4 w-4" /><span>Created {formatDate(pkg.createdAt)}</span></div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader><CardTitle className="text-lg text-red-600">Danger Zone</CardTitle></CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}><Trash2 className="h-4 w-4 mr-2" />Delete Package</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Package</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone. This will permanently delete the package.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
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
