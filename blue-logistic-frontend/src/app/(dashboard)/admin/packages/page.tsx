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
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader title="All Packages" description="Manage all packages across sellers" />

        <Card className="bg-white shadow-lg border-slate-200">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : data?.content.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <PackageIcon className="h-16 w-16 text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg">No packages found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">Customer</TableHead>
                      <TableHead className="font-semibold text-slate-700">Seller</TableHead>
                      <TableHead className="font-semibold text-slate-700">Description</TableHead>
                      <TableHead className="font-semibold text-slate-700">Weight</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                      <TableHead className="font-semibold text-slate-700">Tracking</TableHead>
                      <TableHead className="font-semibold text-slate-700">Created</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.content.map((pkg) => (
                      <TableRow key={pkg.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="font-medium text-slate-900">{pkg.customerName}</TableCell>
                        <TableCell className="text-slate-700">{pkg.sellerName}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-slate-600">{pkg.description}</TableCell>
                        <TableCell className="text-slate-700">{formatWeight(pkg.weight)}</TableCell>
                        <TableCell><StatusBadge status={pkg.status} /></TableCell>
                        <TableCell className="font-mono text-sm text-slate-600">{pkg.trackingNumber || "-"}</TableCell>
                        <TableCell className="text-slate-600">{formatDate(pkg.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/packages/${pkg.id}`}>
                            <Button variant="ghost" size="sm" className="hover:bg-[#0D2556]/5 hover:text-[#0D2556]">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
