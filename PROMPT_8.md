# PROMPT 8: Admin Seller Pages

Working directory: ~/BlueLogistic/blue-logistic-frontend/src/

## File 1: src/components/forms/SellerForm.tsx

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createSellerSchema, CreateSellerFormData } from "@/lib/validations";

interface SellerFormProps {
  onSubmit: (data: CreateSellerFormData) => void;
  isLoading?: boolean;
}

export function SellerForm({ onSubmit, isLoading = false }: SellerFormProps) {
  const form = useForm<CreateSellerFormData>({
    resolver: zodResolver(createSellerSchema),
    defaultValues: { name: "", email: "", password: "", companyName: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl><Input placeholder="John Doe" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="companyName" render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl><Input placeholder="Acme Corp" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="john@acme.com" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Password</FormLabel>
              <FormControl><Input type="password" placeholder="Min 8 characters" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <Button type="submit" className="w-full md:w-auto bg-brand-orange hover:opacity-90" disabled={isLoading}>
          {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : "Create Seller"}
        </Button>
      </form>
    </Form>
  );
}
```

## File 2: src/app/(dashboard)/admin/sellers/page.tsx

```typescript
"use client";

import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { useSellers, useUpdateSellerStatus } from "@/hooks/useSellers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Users, Eye, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminSellersPage() {
  const { data, isLoading } = useSellers();
  const { mutate: updateStatus, isPending } = useUpdateSellerStatus();

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateStatus({ id, request: { isActive: !currentStatus } });
  };

  return (
    <>
      <Header title="Sellers" />
      <div className="p-4 sm:p-6">
        <PageHeader title="Sellers" description="Manage seller accounts" actionLabel="Add Seller" actionHref="/admin/sellers/new" />

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : data?.content.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500">No sellers yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.content.map((seller) => (
                    <TableRow key={seller.id}>
                      <TableCell className="font-medium">{seller.companyName}</TableCell>
                      <TableCell>{seller.name}</TableCell>
                      <TableCell>{seller.email}</TableCell>
                      <TableCell>
                        <Badge variant={seller.isActive ? "default" : "secondary"}>
                          {seller.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(seller.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(seller.id, seller.isActive)} disabled={isPending}>
                            {seller.isActive ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4 text-slate-400" />}
                          </Button>
                          <Link href={`/admin/sellers/${seller.id}`}>
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                          </Link>
                        </div>
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

## File 3: src/app/(dashboard)/admin/sellers/new/page.tsx

```typescript
"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SellerForm } from "@/components/forms/SellerForm";
import { useCreateSeller } from "@/hooks/useSellers";
import { Card, CardContent } from "@/components/ui/card";
import { CreateSellerFormData } from "@/lib/validations";

export default function NewSellerPage() {
  const router = useRouter();
  const { mutate: createSeller, isPending } = useCreateSeller();

  const handleSubmit = (data: CreateSellerFormData) => {
    createSeller(data, { onSuccess: () => router.push("/admin/sellers") });
  };

  return (
    <>
      <Header title="Add Seller" />
      <div className="p-4 sm:p-6">
        <PageHeader title="Add New Seller" description="Create a new seller account" backHref="/admin/sellers" />
        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <SellerForm onSubmit={handleSubmit} isLoading={isPending} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
```

## File 4: src/app/(dashboard)/admin/sellers/[id]/page.tsx

```typescript
"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/packages/StatusBadge";
import { useSeller, useUpdateSellerStatus } from "@/hooks/useSellers";
import { usePackages } from "@/hooks/usePackages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatWeight } from "@/lib/utils";
import Link from "next/link";
import { Building, Mail, Calendar, Eye } from "lucide-react";

export default function SellerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: seller, isLoading: isLoadingSeller } = useSeller(id);
  const { data: packages, isLoading: isLoadingPackages } = usePackages();
  const { mutate: updateStatus, isPending } = useUpdateSellerStatus();

  const sellerPackages = packages?.content.filter((p) => p.sellerId === id) || [];

  const handleToggleStatus = () => {
    if (seller) {
      updateStatus({ id, request: { isActive: !seller.isActive } });
    }
  };

  if (isLoadingSeller) {
    return (
      <>
        <Header title="Seller Details" />
        <div className="p-4 sm:p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64" />
        </div>
      </>
    );
  }

  if (!seller) {
    return (<><Header title="Seller Details" /><div className="p-4 sm:p-6"><p>Seller not found</p></div></>);
  }

  return (
    <>
      <Header title="Seller Details" />
      <div className="p-4 sm:p-6">
        <PageHeader title={seller.companyName} backHref="/admin/sellers" />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Seller Info</CardTitle>
                <Badge variant={seller.isActive ? "default" : "secondary"}>
                  {seller.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2"><Building className="h-4 w-4 text-slate-400" /><span className="font-medium">{seller.companyName}</span></div>
              <div><p className="text-sm text-slate-500">Contact</p><p className="font-medium">{seller.name}</p></div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /><span>{seller.email}</span></div>
              <div className="flex items-center gap-2 text-sm text-slate-500"><Calendar className="h-4 w-4" /><span>Joined {formatDate(seller.createdAt)}</span></div>
              <div className="pt-4 border-t">
                <Button variant={seller.isActive ? "destructive" : "default"} onClick={handleToggleStatus} disabled={isPending} className="w-full">
                  {seller.isActive ? "Deactivate Seller" : "Activate Seller"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-lg">Packages ({sellerPackages.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              {isLoadingPackages ? (
                <div className="p-6"><Skeleton className="h-24" /></div>
              ) : sellerPackages.length === 0 ? (
                <div className="p-6 text-center text-slate-500">No packages from this seller yet</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sellerPackages.slice(0, 10).map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.customerName}</TableCell>
                        <TableCell>{formatWeight(pkg.weight)}</TableCell>
                        <TableCell><StatusBadge status={pkg.status} /></TableCell>
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
      </div>
    </>
  );
}
```

---

## 🎉 FRONTEND COMPLETE!

After creating all files, run:
```bash
cd ~/BlueLogistic/blue-logistic-frontend
npm run dev
```

### Test Checklist:
1. ✅ Login as admin (admin@bluelogistic.com / password)
2. ✅ View all packages
3. ✅ Update package status
4. ✅ Add tracking number
5. ✅ View/create/toggle sellers
6. ✅ Login as seller (john@shop.com / seller123)
7. ✅ View own packages
8. ✅ Create new package

### Brand Colors:
- Primary: #0D2556 (dark blue) - Sidebar, headers
- Accent: #D8420E (orange) - Action buttons, active states
