"use client";

import { ShoppingCart, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";
import { useOrderSummary } from "@/features/reports/hooks";
import { formatNPR } from "@/lib/utils";


export function OrderSummaryTab() {
  const { data, isLoading, error } = useOrderSummary();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-[#F4F3EE] animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-sm text-red-600 py-8 text-center">{error ?? "No data"}</p>;
  }

  return (
    <div className="space-y-5">
      {/* Status KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Orders", value: data.totalOrders, icon: ShoppingCart, color: "bg-white" },
          { label: "Pending", value: data.pendingOrders, icon: Clock, color: "bg-blue-50" },
          { label: "Processing", value: data.processingOrders, icon: Clock, color: "bg-amber-50" },
          { label: "Delivered", value: data.deliveredOrders, icon: CheckCircle, color: "bg-emerald-50" },
          { label: "Cancelled", value: data.cancelledOrders, icon: XCircle, color: "bg-[#F4F3EE]" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`${color} rounded-2xl p-4 border border-[#E4E1D8]`}>
            <div className="size-8 rounded-full bg-black/5 flex items-center justify-center mb-3">
              <Icon className="size-4 text-[#171717]" />
            </div>
            <p className="text-2xl font-bold text-[#171717] leading-tight">{value}</p>
            <p className="text-xs text-[#77776F] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Total spend card */}
      <div className="bg-[#DFFF3F] rounded-2xl p-5 border border-[#E4E1D8] flex items-center gap-4">
        <div className="size-12 rounded-xl bg-[#171717]/10 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="size-6 text-[#171717]" />
        </div>
        <div>
          <p className="text-xs font-medium text-[#171717]/60 mb-0.5">Total Spend (Delivered Orders)</p>
          <p className="text-3xl font-bold text-[#171717] tracking-tight">{formatNPR(data.totalSpend)}</p>
        </div>
      </div>

      {/* Supplier breakdown */}
      <div className="bg-white rounded-2xl border border-[#E4E1D8] p-5">
        <p className="text-sm font-semibold text-[#171717] mb-4">Spend by Supplier</p>
        {data.supplierBreakdown.length === 0 ? (
          <p className="text-xs text-[#77776F] text-center py-4">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[#77776F] uppercase tracking-wide border-b border-[#E4E1D8]">
                <th className="text-left pb-2 font-medium">Supplier</th>
                <th className="text-right pb-2 font-medium">Orders</th>
                <th className="text-right pb-2 font-medium">Total Spend</th>
                <th className="text-right pb-2 font-medium">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {data.supplierBreakdown.map((s) => (
                <tr key={s.supplier} className="border-b border-[#F4F3EE] last:border-0">
                  <td className="py-3 font-medium text-[#171717]">{s.supplier}</td>
                  <td className="py-3 text-right tabular-nums text-[#77776F]">{s.orderCount}</td>
                  <td className="py-3 text-right tabular-nums font-medium text-[#171717]">
                    {formatNPR(s.totalSpend)}
                  </td>
                  <td className="py-3 text-right text-xs text-[#77776F] whitespace-nowrap">
                    {s.lastOrderDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
