# PROMPT 6: Seller Package Pages

Working directory: ~/BlueLogistic/blue-logistic-frontend/src/

## File 1: src/components/packages/StatusBadge.tsx

```typescript
import { Badge } from "@/components/ui/badge";
import { PackageStatus } from "@/types";
import { getStatusLabel, getStatusColor, cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: PackageStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(getStatusColor(status), className)}>
      {getStatusLabel(status)}
    </Badge>
  );
}
```

## File 2: src/components/packages/PackageCard.tsx

```typescript
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
```

## File 3: src/components/forms/PackageForm.tsx

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createPackageSchema, CreatePackageFormData } from "@/lib/validations";

interface PackageFormProps {
  onSubmit: (data: CreatePackageFormData) => void;
  isLoading?: boolean;
}

export function PackageForm({ onSubmit, isLoading = false }: PackageFormProps) {
  const form = useForm<CreatePackageFormData>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      description: "",
      weight: 0,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      deliveryAddress: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField control={form.control} name="customerName" render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl><Input placeholder="John Doe" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="customerEmail" render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Email</FormLabel>
              <FormControl><Input type="email" placeholder="john@example.com" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="customerPhone" render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Phone</FormLabel>
              <FormControl><Input placeholder="+355 123 456 789" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="weight" render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="1.5" disabled={isLoading} {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
          <FormItem>
            <FormLabel>Delivery Address</FormLabel>
            <FormControl><Textarea placeholder="Street, City, Postal Code" rows={2} disabled={isLoading} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Package Description</FormLabel>
            <FormControl><Textarea placeholder="Describe the package contents" rows={3} disabled={isLoading} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" className="w-full md:w-auto bg-brand-orange hover:opacity-90" disabled={isLoading}>
          {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : "Create Package"}
        </Button>
      </form>
    </Form>
  );
}
```

## File 4: src/app/(dashboard)/seller/packages/page.tsx

```typescript
"use client";

import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { PackageCard } from "@/components/packages/PackageCard";
import { usePackages } from "@/hooks/usePackages";
import { Skeleton } from "@/components/ui/skeleton";
import { Package as PackageIcon } from "lucide-react";

export default function SellerPackagesPage() {
  const { data, isLoading } = usePackages();

  return (
    <>
      <Header title="My Packages" />
      <div className="p-4 sm:p-6">
        <PageHeader title="My Packages" description="View and manage your packages" actionLabel="New Package" actionHref="/seller/packages/new" />

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
          </div>
        ) : data?.content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <PackageIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold">No packages yet</h3>
            <p className="text-slate-500 mt-1">Create your first package to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.content.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} href={`/seller/packages/${pkg.id}`} />)}
          </div>
        )}
      </div>
    </>
  );
}
```

## File 5: src/app/(dashboard)/seller/packages/new/page.tsx

```typescript
"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { PackageForm } from "@/components/forms/PackageForm";
import { useCreatePackage } from "@/hooks/usePackages";
import { Card, CardContent } from "@/components/ui/card";
import { CreatePackageFormData } from "@/lib/validations";

export default function NewPackagePage() {
  const router = useRouter();
  const { mutate: createPackage, isPending } = useCreatePackage();

  const handleSubmit = (data: CreatePackageFormData) => {
    createPackage(data, { onSuccess: () => router.push("/seller/packages") });
  };

  return (
    <>
      <Header title="New Package" />
      <div className="p-4 sm:p-6">
        <PageHeader title="Create New Package" description="Enter the package and customer details" backHref="/seller/packages" />
        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <PackageForm onSubmit={handleSubmit} isLoading={isPending} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
```

## File 6: src/app/(dashboard)/seller/packages/[id]/page.tsx

```typescript
"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/packages/StatusBadge";
import { usePackage } from "@/hooks/usePackages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatWeight } from "@/lib/utils";
import { MapPin, Phone, Mail, Scale, Calendar, Truck } from "lucide-react";

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
              <div className="flex items-center gap-2 text-sm text-slate-500"><Calendar className="h-4 w-4" /><span>Created {formatDate(pkg.createdAt)}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
```

---

Test by logging in as seller (john@shop.com / seller123) and creating a package.
