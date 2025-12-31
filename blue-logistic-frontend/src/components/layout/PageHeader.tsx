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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        {backHref && (
          <Link href={backHref}>
            <Button variant="ghost" size="icon" className="shrink-0 hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        )}
        <div>
          <h2 className="text-3xl font-bold text-[#0D2556]">{title}</h2>
          {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
        </div>
      </div>

      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link href={actionHref}>
            <Button className="bg-[#D8420E] hover:bg-[#B8380C] text-white shadow-md hover:shadow-lg transition-all">
              <Plus className="h-4 w-4 mr-2" />
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onAction} className="bg-[#D8420E] hover:bg-[#B8380C] text-white shadow-md hover:shadow-lg transition-all">
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
