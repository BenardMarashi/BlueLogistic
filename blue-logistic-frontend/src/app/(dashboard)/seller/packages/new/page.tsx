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
