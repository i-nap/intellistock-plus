"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { Button } from "@/components/ui/button";
import { INVENTORY_STATUS } from "@/constants/status";
import { useInventory, useAdjustStock } from "@/features/inventory/hooks";
import { useCurrentUser } from "@/features/auth/hooks";
import type { InventoryStatus } from "@/features/inventory/types";
import type { AdjustStockFormValues } from "@/features/inventory/schemas";

const STATUS_FILTERS: { label: string; value: InventoryStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "In Stock", value: INVENTORY_STATUS.IN_STOCK as InventoryStatus },
  { label: "Low Stock", value: INVENTORY_STATUS.LOW_STOCK as InventoryStatus },
  { label: "Out of Stock", value: INVENTORY_STATUS.OUT_OF_STOCK as InventoryStatus },
];

export default function InventoryPage() {
  const currentUser = useCurrentUser();
  const canEdit = currentUser?.role !== "VIEWER";

  const [statusFilter, setStatusFilter] = useState<InventoryStatus | "ALL">("ALL");

  const { data: items, isLoading, error, refetch } = useInventory();
  const { adjust, isLoading: isAdjusting, error: adjustError } = useAdjustStock();

  const filtered =
    statusFilter === "ALL" ? items : items.filter((item) => item.status === statusFilter);

  const lowStockCount = items.filter((i) => i.status === INVENTORY_STATUS.LOW_STOCK).length;
  const outOfStockCount = items.filter((i) => i.status === INVENTORY_STATUS.OUT_OF_STOCK).length;

  async function handleAdjust(id: number, data: AdjustStockFormValues): Promise<boolean> {
    const result = await adjust(id, data);
    if (result) refetch();
    return !!result;
  }

  return (
    <div>
      <PageHeader title="Inventory" description="Track stock levels and adjust quantities">
        {(lowStockCount > 0 || outOfStockCount > 0) && (
          <div className="flex items-center gap-2 text-sm">
            {lowStockCount > 0 && (
              <span className="bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-xs font-medium">
                {lowStockCount} low stock
              </span>
            )}
            {outOfStockCount > 0 && (
              <span className="bg-red-50 border border-red-200 text-red-700 rounded-full px-3 py-1 text-xs font-medium">
                {outOfStockCount} out of stock
              </span>
            )}
          </div>
        )}
      </PageHeader>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-[#E4E1D8] p-1 w-fit mb-4">
        {STATUS_FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === value
                ? "bg-[#171717] text-white"
                : "text-[#77776F] hover:text-[#171717]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-[#E4E1D8] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="size-6 border-2 border-[#DFFF3F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <Button variant="ghost" size="sm" onClick={refetch} className="mt-2">
              Try again
            </Button>
          </div>
        ) : (
          <InventoryTable
            items={filtered}
            onAdjust={handleAdjust}
            isAdjusting={isAdjusting}
            adjustError={adjustError}
            canEdit={canEdit}
          />
        )}
      </div>
    </div>
  );
}
