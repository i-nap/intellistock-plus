"use client";

import { useState } from "react";
import { ArrowUpDown, Boxes } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { StockAdjustmentDialog } from "./stock-adjustment-dialog";
import type { InventoryItem } from "@/features/inventory/types";
import type { AdjustStockFormValues } from "@/features/inventory/schemas";

interface InventoryTableProps {
  items: InventoryItem[];
  onAdjust: (id: number, data: AdjustStockFormValues) => Promise<boolean>;
  isAdjusting: boolean;
  adjustError?: string | null;
  canEdit?: boolean;
}

export function InventoryTable({ items, onAdjust, isAdjusting, adjustError, canEdit = true }: InventoryTableProps) {
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);

  async function handleAdjust(data: AdjustStockFormValues) {
    if (!adjustingItem) return;
    const ok = await onAdjust(adjustingItem.id, data);
    if (ok) setAdjustingItem(null);
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-12 rounded-xl bg-[#F4F3EE] flex items-center justify-center mb-3">
          <Boxes className="size-6 text-[#77776F]" />
        </div>
        <p className="text-sm font-medium text-[#171717]">No inventory items</p>
        <p className="text-xs text-[#77776F] mt-1">
          Create a product to automatically add it to inventory.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Reorder At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            {canEdit && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <code className="text-xs text-[#77776F]">{item.product.sku}</code>
                </div>
              </TableCell>
              <TableCell>{item.product.category}</TableCell>
              <TableCell>
                <span
                  className={
                    item.quantity <= item.reorderThreshold
                      ? "font-semibold text-amber-600"
                      : "font-medium"
                  }
                >
                  {item.quantity}
                </span>
              </TableCell>
              <TableCell className="text-[#77776F]">{item.reorderThreshold}</TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell className="text-[#77776F]">{item.location ?? "—"}</TableCell>
              {canEdit && (
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAdjustingItem(item)}
                    className="gap-1.5"
                  >
                    <ArrowUpDown className="size-3" />
                    Adjust
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <StockAdjustmentDialog
        item={adjustingItem}
        open={!!adjustingItem}
        onOpenChange={(open) => !open && setAdjustingItem(null)}
        onSubmit={handleAdjust}
        isLoading={isAdjusting}
        error={adjustError}
      />
    </>
  );
}
