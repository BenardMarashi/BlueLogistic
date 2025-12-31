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
