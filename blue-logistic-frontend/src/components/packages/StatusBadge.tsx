"use client";

import { Badge } from "@/components/ui/badge";
import { PackageStatus } from "@/types";
import { getStatusColor, cn } from "@/lib/utils";
import { useTranslations } from "@/hooks/useLocale";

interface StatusBadgeProps {
  status: PackageStatus;
  className?: string;
}

const STATUS_KEYS: Record<PackageStatus, string> = {
  CREATED: "created",
  IN_STORAGE: "inStorage",
  DISPATCHED: "dispatched",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const t = useTranslations("status");

  return (
    <Badge variant="outline" className={cn(getStatusColor(status), className)}>
      {t(STATUS_KEYS[status])}
    </Badge>
  );
}
