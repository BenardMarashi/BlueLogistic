"use client";

import { Button } from "@/components/ui/button";
import { PackageStatus } from "@/types";
import { STATUS_NEXT } from "@/lib/constants";
import { Loader2, ArrowRight } from "lucide-react";
import { useTranslations } from "@/hooks/useLocale";

interface StatusUpdateFormProps {
  currentStatus: PackageStatus;
  onUpdate: (newStatus: PackageStatus) => void;
  isLoading?: boolean;
}

const STATUS_KEYS: Record<PackageStatus, string> = {
  CREATED: "created",
  IN_STORAGE: "inStorage",
  DISPATCHED: "dispatched",
};

export function StatusUpdateForm({ currentStatus, onUpdate, isLoading }: StatusUpdateFormProps) {
  const t = useTranslations("status");
  const nextStatus = STATUS_NEXT[currentStatus];

  if (!nextStatus) {
    return <p className="text-sm text-slate-500">{t("dispatched")}</p>;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">{t(STATUS_KEYS[currentStatus])}</span>
        <ArrowRight className="h-4 w-4" />
        <span className="font-medium">{t(STATUS_KEYS[nextStatus])}</span>
      </div>
      <Button onClick={() => onUpdate(nextStatus)} disabled={isLoading} className="bg-brand-blue hover:opacity-90">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t(STATUS_KEYS[nextStatus])}
      </Button>
    </div>
  );
}
