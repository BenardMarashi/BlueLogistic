"use client";

import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { PackageCard } from "@/components/packages/PackageCard";
import { usePackages } from "@/hooks/usePackages";
import { Skeleton } from "@/components/ui/skeleton";
import { Package as PackageIcon } from "lucide-react";
import { useTranslations } from "@/hooks/useLocale";

export default function SellerPackagesPage() {
  const { data, isLoading } = usePackages();
  const t = useTranslations("packages");
  const tn = useTranslations("nav");

  return (
    <>
      <Header title={t("myPackages")} />
      <div className="p-4 sm:p-6">
        <PageHeader title={t("myPackages")} description={t("viewAndManage")} actionLabel={tn("newPackage")} actionHref="/seller/packages/new" />

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
          </div>
        ) : data?.content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <PackageIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold">{t("noPackagesYet")}</h3>
            <p className="text-slate-500 mt-1">{t("createFirstPackage")}</p>
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
