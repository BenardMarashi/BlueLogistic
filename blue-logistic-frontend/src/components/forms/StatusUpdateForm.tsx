"use client";

import { Button } from "@/components/ui/button";
import { PackageStatus } from "@/types";
import { STATUS_NEXT } from "@/lib/constants";
import { getStatusLabel } from "@/lib/utils";
import { Loader2, ArrowRight } from "lucide-react";

interface StatusUpdateFormProps {
  currentStatus: PackageStatus;
  onUpdate: (newStatus: PackageStatus) => void;
  isLoading?: boolean;
}

export function StatusUpdateForm({ currentStatus, onUpdate, isLoading }: StatusUpdateFormProps) {
  const nextStatus = STATUS_NEXT[currentStatus];

  if (!nextStatus) {
    return <p className="text-sm text-slate-500">This package has reached its final status.</p>;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">{getStatusLabel(currentStatus)}</span>
        <ArrowRight className="h-4 w-4" />
        <span className="font-medium">{getStatusLabel(nextStatus)}</span>
      </div>
      <Button onClick={() => onUpdate(nextStatus)} disabled={isLoading} className="bg-brand-blue hover:opacity-90">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Mark as ${getStatusLabel(nextStatus)}`}
      </Button>
    </div>
  );
}
