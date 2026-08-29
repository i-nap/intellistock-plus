"use client";

import React, { useState } from "react";
import { ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./order-status-badge";
import { formatNPR } from "@/lib/utils";
import type { Order } from "@/features/orders/types";
import type { OrderStatus } from "@/constants/status";

interface OrderTableProps {
  orders: Order[];
  onUpdateStatus: (id: number, status: OrderStatus) => Promise<void>;
  isUpdating: boolean;
  canEdit?: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_ACTIONS: Partial<Record<OrderStatus, { label: string; next: OrderStatus; variant: "default" | "destructive" }[]>> = {
  PENDING: [
    { label: "Mark Processing", next: "PROCESSING", variant: "default" },
    { label: "Cancel", next: "CANCELLED", variant: "destructive" },
  ],
  PROCESSING: [
    { label: "Mark Delivered", next: "DELIVERED", variant: "default" },
    { label: "Cancel", next: "CANCELLED", variant: "destructive" },
  ],
};

export function OrderTable({ orders, onUpdateStatus, isUpdating, canEdit = true }: OrderTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function handleAction(orderId: number, next: OrderStatus) {
    setUpdatingId(orderId);
    await onUpdateStatus(orderId, next);
    setUpdatingId(null);
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-12 rounded-xl bg-[#F4F3EE] flex items-center justify-center mb-3">
          <ShoppingCart className="size-6 text-[#77776F]" />
        </div>
        <p className="text-sm font-medium text-[#171717]">No orders found</p>
        <p className="text-xs text-[#77776F] mt-1">Create your first purchase order to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8" />
          <TableHead>Order #</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ordered</TableHead>
          <TableHead>Expected</TableHead>
          {canEdit && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const isExpanded = expandedId === order.id;
          const actions = STATUS_ACTIONS[order.status] ?? [];

          return (
            <React.Fragment key={order.id}>
              <TableRow>
                <TableCell>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="flex items-center justify-center size-6 rounded text-[#77776F] hover:text-[#171717] transition-colors"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </button>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-[#F4F3EE] px-1.5 py-0.5 rounded font-mono">
                    {order.orderNumber}
                  </code>
                </TableCell>
                <TableCell className="font-medium">{order.supplier.name}</TableCell>
                <TableCell className="text-[#77776F]">{order.items.length}</TableCell>
                <TableCell className="font-medium tabular-nums">
                  {formatNPR(Number(order.totalAmount))}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-[#77776F]">{formatDate(order.orderedAt)}</TableCell>
                <TableCell className="text-[#77776F]">
                  {order.expectedDelivery ? formatDate(order.expectedDelivery) : "—"}
                </TableCell>
                {canEdit && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {actions.map((action) => (
                        <Button
                          key={action.next}
                          size="sm"
                          variant={action.variant === "destructive" ? "destructive" : "outline"}
                          disabled={isUpdating && updatingId === order.id}
                          onClick={() => handleAction(order.id, action.next)}
                          className="h-7 text-xs px-2.5"
                        >
                          {isUpdating && updatingId === order.id ? "…" : action.label}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                )}
              </TableRow>

              {isExpanded && (
                <TableRow className="bg-[#F9F8F5] hover:bg-[#F9F8F5]">
                  <TableCell colSpan={9} className="py-0">
                    <div className="py-3 px-4">
                      {order.notes && (
                        <p className="text-xs text-[#77776F] mb-3 italic">Note: {order.notes}</p>
                      )}
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-[#77776F] uppercase tracking-wide">
                            <th className="text-left pb-1 font-medium">Product</th>
                            <th className="text-left pb-1 font-medium">SKU</th>
                            <th className="text-right pb-1 font-medium">Qty</th>
                            <th className="text-right pb-1 font-medium">Unit Price</th>
                            <th className="text-right pb-1 font-medium">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr key={item.id} className="border-t border-[#E4E1D8]">
                              <td className="py-1.5">{item.product.name}</td>
                              <td className="py-1.5">
                                <code className="text-xs text-[#77776F]">{item.product.sku}</code>
                              </td>
                              <td className="py-1.5 text-right tabular-nums">{item.quantity}</td>
                              <td className="py-1.5 text-right tabular-nums">
                                {formatNPR(Number(item.unitPrice))}
                              </td>
                              <td className="py-1.5 text-right font-medium tabular-nums">
                                {formatNPR(Number(item.subtotal))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-[#E4E1D8]">
                            <td colSpan={4} className="pt-2 text-right text-xs font-medium text-[#77776F] uppercase tracking-wide">
                              Total
                            </td>
                            <td className="pt-2 text-right font-semibold tabular-nums">
                              {formatNPR(Number(order.totalAmount))}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
