"use client";

import { useState } from "react";
import { RefreshCw, Zap } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { ReorderTable } from "@/components/reorder/reorder-table";
import { GenerateOrderDialog } from "@/components/reorder/generate-order-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useReorderRecommendations, useGenerateOrder } from "@/features/reorder/hooks";
import { useSuppliers } from "@/features/suppliers/hooks";
import { useCurrentUser } from "@/features/auth/hooks";
import type { ReorderRecommendation } from "@/features/reorder/types";

type UrgencyFilter = "ALL" | "OUT_OF_STOCK" | "LOW_STOCK";

const URGENCY_TABS: { label: string; value: UrgencyFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
  { label: "Low Stock", value: "LOW_STOCK" },
];

export default function ReorderPage() {
  const currentUser = useCurrentUser();
  const canEdit = currentUser?.role !== "VIEWER";

  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("ALL");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [generateOpen, setGenerateOpen] = useState(false);

  const { data: items, isLoading, error, refetch } = useReorderRecommendations();
  const { generate, isLoading: isGenerating, error: generateError } = useGenerateOrder();
  const { data: suppliers } = useSuppliers();

  const filtered = urgencyFilter === "ALL"
    ? items
    : items.filter((i) => i.urgency === urgencyFilter);

  function handleToggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleToggleAll() {
    if (filtered.every((i) => selected.has(i.inventoryItemId))) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((i) => next.delete(i.inventoryItemId));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((i) => next.add(i.inventoryItemId));
        return next;
      });
    }
  }

  const selectedItems: ReorderRecommendation[] = items.filter((i) =>
    selected.has(i.inventoryItemId)
  );

  async function handleGenerateOrder(supplierId: number) {
    const result = await generate({
      supplierId,
      items: selectedItems.map((i) => ({
        inventoryItemId: i.inventoryItemId,
        quantity: i.suggestedQuantity,
      })),
    });
    if (result) {
      setGenerateOpen(false);
      setSelected(new Set());
      refetch();
    }
  }

  const outOfStockCount = items.filter((i) => i.urgency === "OUT_OF_STOCK").length;
  const lowStockCount = items.filter((i) => i.urgency === "LOW_STOCK").length;

  return (
    <div>
      <PageHeader title="Reorder Engine" description="Items below minimum stock thresholds">
        <div className="flex items-center gap-2">
          {outOfStockCount > 0 && (
            <span className="bg-red-50 border border-red-200 text-red-700 rounded-full px-3 py-1 text-xs font-medium">
              {outOfStockCount} out of stock
            </span>
          )}
          {lowStockCount > 0 && (
            <span className="bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-xs font-medium">
              {lowStockCount} low stock
            </span>
          )}
          <Button
            onClick={refetch}
            variant="outline"
            className="gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {canEdit && selected.size > 0 && (
            <Button
              onClick={() => setGenerateOpen(true)}
              className="bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent gap-2"
            >
              <Zap className="size-4" />
              Generate Order ({selected.size})
            </Button>
          )}
        </div>
      </PageHeader>

      {/* Urgency filter tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-[#E4E1D8] p-1 w-fit mb-4">
        {URGENCY_TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setUrgencyFilter(value)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              urgencyFilter === value
                ? "bg-[#171717] text-white"
                : "text-[#77776F] hover:text-[#171717]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

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
          <ReorderTable
            items={filtered}
            selected={selected}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
          />
        )}
      </div>

      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate Purchase Order</DialogTitle>
            <DialogDescription>
              Select a supplier for the selected items. Quantities use the suggested reorder amounts.
            </DialogDescription>
          </DialogHeader>
          <GenerateOrderDialog
            selected={selectedItems}
            suppliers={suppliers}
            onSubmit={handleGenerateOrder}
            onCancel={() => setGenerateOpen(false)}
            isLoading={isGenerating}
            error={generateError}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
