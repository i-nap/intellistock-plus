import { cn } from "@/lib/utils";
import type { InventoryStatus } from "@/features/inventory/types";

const STATUS_CONFIG: Record<InventoryStatus, { label: string; className: string }> = {
  IN_STOCK: {
    label: "In Stock",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  LOW_STOCK: {
    label: "Low Stock",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  OUT_OF_STOCK: {
    label: "Out of Stock",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

interface StatusBadgeProps {
  status: InventoryStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
