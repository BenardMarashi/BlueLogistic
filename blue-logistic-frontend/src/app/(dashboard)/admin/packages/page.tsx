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
