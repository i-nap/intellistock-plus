"use client";

import { RefreshCw } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { ReorderRecommendation } from "@/features/reorder/types";

interface ReorderTableProps {
  items: ReorderRecommendation[];
  selected: Set<number>;
  onToggle: (inventoryItemId: number) => void;
  onToggleAll: () => void;
}

const URGENCY_CONFIG: Record<string, { label: string; className: string }> = {
  OUT_OF_STOCK: { label: "Out of Stock", className: "bg-red-50 text-red-700 border-red-200" },
  LOW_STOCK: { label: "Low Stock", className: "bg-amber-50 text-amber-700 border-amber-200" },
};

export function ReorderTable({ items, selected, onToggle, onToggleAll }: ReorderTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-12 rounded-xl bg-[#F4F3EE] flex items-center justify-center mb-3">
          <RefreshCw className="size-6 text-[#77776F]" />
        </div>
        <p className="text-sm font-medium text-[#171717]">No items need reordering</p>
        <p className="text-xs text-[#77776F] mt-1">All stock levels are above their minimum thresholds.</p>
      </div>
    );
  }

  const allSelected = items.length > 0 && items.every((i) => selected.has(i.inventoryItemId));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onToggleAll}
              className="rounded border-[#E4E1D8] accent-[#171717]"
              aria-label="Select all"
            />
          </TableHead>
          <TableHead>Product</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Current</TableHead>
          <TableHead className="text-right">Min Threshold</TableHead>
          <TableHead className="text-right" title="Average units sold per day over the last 30 days">
            Daily Usage
          </TableHead>
          <TableHead className="text-right" title="Stock needed to cover demand across the supplier lead time">
            Reorder Level
          </TableHead>
          <TableHead className="text-right">Suggested Order</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const urgency = URGENCY_CONFIG[item.urgency] ?? URGENCY_CONFIG.LOW_STOCK;
          const isSelected = selected.has(item.inventoryItemId);

          return (
            <TableRow
              key={item.inventoryItemId}
              className={isSelected ? "bg-[#FAFFF0]" : undefined}
            >
              <TableCell>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(item.inventoryItemId)}
                  className="rounded border-[#E4E1D8] accent-[#171717]"
                  aria-label={`Select ${item.productName}`}
                />
              </TableCell>
              <TableCell className="font-medium">{item.productName}</TableCell>
              <TableCell>
                <code className="text-xs bg-[#F4F3EE] px-1.5 py-0.5 rounded font-mono">
                  {item.sku}
                </code>
              </TableCell>
              <TableCell className="text-[#77776F]">{item.category || "—"}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${urgency.className}`}
                >
                  {urgency.label}
                </span>
              </TableCell>
              <TableCell className="text-right tabular-nums font-medium text-[#EF4444]">
                {item.currentQuantity}
              </TableCell>
              <TableCell className="text-right tabular-nums text-[#77776F]">
                {item.reorderThreshold}
              </TableCell>
              <TableCell className="text-right tabular-nums text-[#77776F]">
                {item.averageDailyUsage.toFixed(2)}
              </TableCell>
              <TableCell className="text-right tabular-nums text-[#77776F]">
                {item.reorderLevel}
                <span className="block text-[10px] text-[#9a9a8e]">
                  {item.leadTimeInDays}d lead
                </span>
              </TableCell>
              <TableCell className="text-right tabular-nums font-semibold text-[#171717]">
                {item.suggestedQuantity}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
