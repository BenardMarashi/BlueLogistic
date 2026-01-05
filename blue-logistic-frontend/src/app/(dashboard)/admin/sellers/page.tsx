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
import { useTranslations } from "@/hooks/useLocale";

export default function AdminSellersPage() {
  const { data, isLoading } = useSellers();
  const { mutate: updateStatus, isPending } = useUpdateSellerStatus();
  const t = useTranslations("sellers");
  const tt = useTranslations("table");
  const tn = useTranslations("nav");

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateStatus({ id, request: { isActive: !currentStatus } });
  };

  return (
    <>
      <Header title={t("title")} />
      <div className="p-4 sm:p-6">
        <PageHeader title={t("title")} description={t("manageAllSellers")} actionLabel={tn("newSeller")} actionHref="/admin/sellers/new" />

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : data?.content.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500">{t("noSellersYet")}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("companyName")}</TableHead>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{tt("email")}</TableHead>
                    <TableHead>{tt("status")}</TableHead>
                    <TableHead>{tt("createdAt")}</TableHead>
                    <TableHead className="text-right">{tt("actions")}</TableHead>
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
                          {seller.isActive ? t("active") : t("inactive")}
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
