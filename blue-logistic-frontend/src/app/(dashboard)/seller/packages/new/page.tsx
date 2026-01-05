"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { PackageForm } from "@/components/forms/PackageForm";
import { useCreatePackage } from "@/hooks/usePackages";
import { Card, CardContent } from "@/components/ui/card";
import { CreatePackageFormData } from "@/lib/validations";
import { useTranslations } from "@/hooks/useLocale";

export default function NewPackagePage() {
  const router = useRouter();
  const { mutate: createPackage, isPending } = useCreatePackage();
  const t = useTranslations("packages");
  const tn = useTranslations("nav");

  const handleSubmit = (data: CreatePackageFormData) => {
    createPackage(data, { onSuccess: () => router.push("/seller/packages") });
  };

  return (
    <>
      <Header title={tn("newPackage")} />
      <div className="p-4 sm:p-6">
        <PageHeader title={t("createPackage")} backHref="/seller/packages" />
        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <PackageForm onSubmit={handleSubmit} isLoading={isPending} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
