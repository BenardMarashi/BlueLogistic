"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useTranslations } from "@/hooks/useLocale";

interface TrackingFormProps {
  onSubmit: (trackingNumber: string) => void;
  isLoading?: boolean;
}

export function TrackingForm({ onSubmit, isLoading }: TrackingFormProps) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const t = useTranslations("tracking");
  const tc = useTranslations("common");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      onSubmit(trackingNumber.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="tracking">{t("trackingNumber")}</Label>
        <Input id="tracking" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder={t("trackingNumber")} disabled={isLoading} />
      </div>
      <Button type="submit" disabled={isLoading || !trackingNumber.trim()} className="bg-brand-orange hover:opacity-90">
        {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{tc("saving")}</>) : t("addTracking")}
      </Button>
    </form>
  );
}
