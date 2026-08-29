"use client";

import { Badge } from "@/components/ui/badge";
import { useRecentOrders } from "@/features/dashboard/hooks";
import { ORDER_STATUS, type OrderStatus } from "@/constants/status";
import { cn, formatNPR } from "@/lib/utils";

const STATUS_STYLES: Record<OrderStatus, string> = {
  [ORDER_STATUS.DELIVERED]: "bg-[#DCFCE7] text-[#16A34A]",
  [ORDER_STATUS.PENDING]: "bg-[#FEF3C7] text-[#92400E]",
  [ORDER_STATUS.PROCESSING]: "bg-[#BDEFF3] text-[#0E7490]",
  [ORDER_STATUS.CANCELLED]: "bg-[#FEE2E2] text-[#B91C1C]",
};

const HEADERS = ["Order ID", "Supplier", "Items", "Total", "Status", "Date"];

export function RecentOrdersTable({ className }: { className?: string }) {
  const { data, isLoading } = useRecentOrders();

  return (
    <div className={`bg-white rounded-2xl flex flex-col gap-4 overflow-hidden ${className ?? ""}`}>
      <div className="px-5 pt-5">
        <p className="text-sm font-semibold text-[#171717]">Recent Orders</p>
        <p className="text-xs text-[#77776F] mt-0.5">Latest supplier orders</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="size-5 border-2 border-[#DFFF3F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-xs text-[#77776F]">No orders yet.</p>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-[#F4F3EE]">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-medium text-[#77776F] px-5 py-3 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[#F4F3EE] last:border-0 hover:bg-[#F4F3EE]/60 transition-colors"
              >
                <td className="px-5 py-3 font-mono text-xs text-[#77776F] whitespace-nowrap">
                  {order.id}
                </td>
                <td className="px-5 py-3 font-medium text-[#171717] whitespace-nowrap">
                  {order.supplier}
                </td>
                <td className="px-5 py-3 text-[#77776F]">{order.items}</td>
                <td className="px-5 py-3 font-medium text-[#171717] tabular-nums whitespace-nowrap">
                  {formatNPR(order.total)}
                </td>
                <td className="px-5 py-3">
                  <Badge
                    className={cn(
                      "text-xs font-medium border-0 shadow-none",
                      STATUS_STYLES[order.status]
                    )}
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-[#77776F] whitespace-nowrap">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
