# PROMPT 7: Admin Package Pages

Working directory: ~/BlueLogistic/blue-logistic-frontend/src/

## File 1: src/components/forms/StatusUpdateForm.tsx

```typescript
"use client";

import { Button } from "@/components/ui/button";
import { PackageStatus } from "@/types";
import { STATUS_NEXT } from "@/lib/constants";
import { getStatusLabel } from "@/lib/utils";
import { Loader2, ArrowRight } from "lucide-react";

interface StatusUpdateFormProps {
  currentStatus: PackageStatus;
  onUpdate: (newStatus: PackageStatus) => void;
  isLoading?: boolean;
}

export function StatusUpdateForm({ currentStatus, onUpdate, isLoading }: StatusUpdateFormProps) {
  const nextStatus = STATUS_NEXT[currentStatus];

  if (!nextStatus) {
    return <p className="text-sm text-slate-500">This package has reached its final status.</p>;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">{getStatusLabel(currentStatus)}</span>
        <ArrowRight className="h-4 w-4" />
        <span className="font-medium">{getStatusLabel(nextStatus)}</span>
      </div>
      <Button onClick={() => onUpdate(nextStatus)} disabled={isLoading} className="bg-brand-blue hover:opacity-90">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Mark as ${getStatusLabel(nextStatus)}`}
      </Button>
    </div>
  );
}
```

## File 2: src/components/forms/TrackingForm.tsx

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface TrackingFormProps {
  onSubmit: (trackingNumber: string) => void;
  isLoading?: boolean;
}

export function TrackingForm({ onSubmit, isLoading }: TrackingFormProps) {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      onSubmit(trackingNumber.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="tracking">Tracking Number</Label>
        <Input id="tracking" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Enter tracking number" disabled={isLoading} />
        <p className="text-xs text-slate-500 mt-1">Adding tracking will automatically mark the package as Dispatched</p>
      </div>
      <Button type="submit" disabled={isLoading || !trackingNumber.trim()} className="bg-brand-orange hover:opacity-90">
        {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</>) : "Add Tracking"}
      </Button>
    </form>
  );
}
```

## File 3: src/app/(dashboard)/admin/packages/page.tsx

```typescript
"use client";

import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/packages/StatusBadge";
import { usePackages } from "@/hooks/usePackages";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatWeight } from "@/lib/utils";
import Link from "next/link";
import { Package as PackageIcon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPackagesPage() {
  const { data, isLoading } = usePackages();

  return (
    <>
      <Header title="All Packages" />
      <div className="p-4 sm:p-6">
        <PageHeader title="All Packages" description="Manage all packages across sellers" />

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : data?.content.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <PackageIcon className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500">No packages found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tracking</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.content.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.customerName}</TableCell>
                      <TableCell>{pkg.sellerName}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{pkg.description}</TableCell>
                      <TableCell>{formatWeight(pkg.weight)}</TableCell>
                      <TableCell><StatusBadge status={pkg.status} /></TableCell>
                      <TableCell className="font-mono text-sm">{pkg.trackingNumber || "-"}</TableCell>
                      <TableCell>{formatDate(pkg.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/packages/${pkg.id}`}>
                          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
```

## File 4: src/app/(dashboard)/admin/packages/[id]/page.tsx

```typescript
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
```

---

Test by logging in as admin (admin@bluelogistic.com / password) and managing packages.
