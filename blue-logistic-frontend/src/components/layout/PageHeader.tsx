import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function PageHeader({ title, description, backHref, actionLabel, actionHref, onAction }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        {backHref && (
          <Link href={backHref}>
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        )}
        <div>
          <h2 className="text-2xl font-bold text-brand-blue">{title}</h2>
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
      </div>

      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link href={actionHref}>
            <Button className="bg-brand-orange hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onAction} className="bg-brand-orange hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
