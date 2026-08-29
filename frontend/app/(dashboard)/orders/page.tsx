"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { OrderTable } from "@/components/orders/order-table";
import { OrderForm } from "@/components/orders/order-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useOrders, useCreateOrder, useUpdateOrderStatus } from "@/features/orders/hooks";
import { useSuppliers } from "@/features/suppliers/hooks";
import { useProducts } from "@/features/products/hooks";
import { useCurrentUser } from "@/features/auth/hooks";
import { ORDER_STATUS, type OrderStatus } from "@/constants/status";
import type { CreateOrderFormValues } from "@/features/orders/schemas";

const STATUS_TABS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: ORDER_STATUS.PENDING },
  { label: "Processing", value: ORDER_STATUS.PROCESSING },
  { label: "Delivered", value: ORDER_STATUS.DELIVERED },
  { label: "Cancelled", value: ORDER_STATUS.CANCELLED },
];

export default function OrdersPage() {
  const currentUser = useCurrentUser();
  const canEdit = currentUser?.role !== "VIEWER";

  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [createOpen, setCreateOpen] = useState(false);

  const { data: orders, isLoading, error, refetch } = useOrders(
    statusFilter === "ALL" ? undefined : statusFilter
  );
  const { create, isLoading: isCreating, error: createError } = useCreateOrder();
  const { updateStatus, isLoading: isUpdating } = useUpdateOrderStatus();
  const { data: suppliers } = useSuppliers();
  const { data: products } = useProducts();

  async function handleCreate(data: CreateOrderFormValues) {
    const result = await create({
      supplierId: data.supplierId,
      items: data.items,
      notes: data.notes,
      expectedDelivery: data.expectedDelivery || undefined,
    });
    if (result) {
      setCreateOpen(false);
      refetch();
    }
  }

  async function handleStatusUpdate(id: number, status: OrderStatus) {
    const result = await updateStatus(id, { status });
    if (result) refetch();
  }

  const pendingCount = orders.filter((o) => o.status === ORDER_STATUS.PENDING).length;
  const processingCount = orders.filter((o) => o.status === ORDER_STATUS.PROCESSING).length;

  return (
    <div>
      <PageHeader title="Purchase Orders" description="Create and track supplier orders">
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1 text-xs font-medium">
              {pendingCount} pending
            </span>
          )}
          {processingCount > 0 && (
            <span className="bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-xs font-medium">
              {processingCount} processing
            </span>
          )}
          {canEdit && (
            <Button
              onClick={() => setCreateOpen(true)}
              className="bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent gap-2"
            >
              <Plus className="size-4" />
              New Order
            </Button>
          )}
        </div>
      </PageHeader>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-[#E4E1D8] p-1 w-fit mb-4">
        {STATUS_TABS.map(({ label, value }) => (
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
          <OrderTable
            orders={orders}
            onUpdateStatus={handleStatusUpdate}
            isUpdating={isUpdating}
            canEdit={canEdit}
          />
        )}
      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Purchase Order</DialogTitle>
            <DialogDescription>
              Select a supplier, add line items, then submit the order.
            </DialogDescription>
          </DialogHeader>
          <OrderForm
            suppliers={suppliers}
            products={products}
            onSubmit={handleCreate}
            isLoading={isCreating}
            error={createError}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
