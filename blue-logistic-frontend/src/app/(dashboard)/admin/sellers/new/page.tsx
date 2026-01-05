"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SellerForm } from "@/components/forms/SellerForm";
import { useCreateSeller } from "@/hooks/useSellers";
import { Card, CardContent } from "@/components/ui/card";
import { CreateSellerFormData } from "@/lib/validations";
import { useTranslations } from "@/hooks/useLocale";

export default function NewSellerPage() {
  const router = useRouter();
  const { mutate: createSeller, isPending } = useCreateSeller();
  const t = useTranslations("sellers");
  const tn = useTranslations("nav");

  const handleSubmit = (data: CreateSellerFormData) => {
    createSeller(data, { onSuccess: () => router.push("/admin/sellers") });
  };

  return (
    <>
      <Header title={tn("newSeller")} />
      <div className="p-4 sm:p-6">
        <PageHeader title={t("createSeller")} backHref="/admin/sellers" />
        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <SellerForm onSubmit={handleSubmit} isLoading={isPending} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
