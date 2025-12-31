import { Badge } from "@/components/ui/badge";
import { PackageStatus } from "@/types";
import { getStatusLabel, getStatusColor, cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: PackageStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(getStatusColor(status), className)}>
      {getStatusLabel(status)}
    </Badge>
  );
}
