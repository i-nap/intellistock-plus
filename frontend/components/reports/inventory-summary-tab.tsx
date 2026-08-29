"use client";

import { Package, Layers, TrendingUp, AlertTriangle } from "lucide-react";
import { useInventorySummary } from "@/features/reports/hooks";
import { formatNPR } from "@/lib/utils";


export function InventorySummaryTab() {
  const { data, isLoading, error } = useInventorySummary();

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

  const { statusBreakdown } = data;
  const statusTotal = statusBreakdown.inStock + statusBreakdown.lowStock + statusBreakdown.outOfStock;
  const pct = (n: number) => statusTotal > 0 ? Math.round((n / statusTotal) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: data.totalProducts.toLocaleString(), icon: Package, color: "bg-[#DFFF3F]" },
          { label: "Total Units", value: data.totalUnits.toLocaleString(), icon: Layers, color: "bg-[#BDEFF3]" },
          { label: "Inventory Value", value: formatNPR(data.totalValue), icon: TrendingUp, color: "bg-white" },
          { label: "Low / Out of Stock", value: `${statusBreakdown.lowStock + statusBreakdown.outOfStock}`, icon: AlertTriangle, color: "bg-white" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`${color} rounded-2xl p-4 border border-[#E4E1D8]`}>
            <div className="size-8 rounded-full bg-black/5 flex items-center justify-center mb-3">
              <Icon className="size-4 text-[#171717]" />
            </div>
            <p className="text-lg font-bold text-[#171717] leading-tight">{value}</p>
            <p className="text-xs text-[#77776F] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="bg-white rounded-2xl border border-[#E4E1D8] p-5">
        <p className="text-sm font-semibold text-[#171717] mb-4">Stock Status Breakdown</p>
        <div className="space-y-3">
          {[
            { label: "In Stock", count: statusBreakdown.inStock, color: "bg-emerald-500" },
            { label: "Low Stock", count: statusBreakdown.lowStock, color: "bg-amber-400" },
            { label: "Out of Stock", count: statusBreakdown.outOfStock, color: "bg-red-500" },
          ].map(({ label, count, color }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#77776F]">{label}</span>
                <span className="font-medium text-[#171717]">{count} ({pct(count)}%)</span>
              </div>
              <div className="h-2 bg-[#F4F3EE] rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all`}
                  style={{ width: `${pct(count)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top products by value */}
        <div className="bg-white rounded-2xl border border-[#E4E1D8] p-5">
          <p className="text-sm font-semibold text-[#171717] mb-4">Top Products by Value</p>
          {data.topProductsByValue.length === 0 ? (
            <p className="text-xs text-[#77776F] text-center py-4">No data</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-[#77776F] uppercase tracking-wide border-b border-[#E4E1D8]">
                  <th className="text-left pb-2 font-medium">Product</th>
                  <th className="text-right pb-2 font-medium">Qty</th>
                  <th className="text-right pb-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.topProductsByValue.map((p) => (
                  <tr key={p.sku} className="border-b border-[#F4F3EE] last:border-0">
                    <td className="py-2">
                      <p className="font-medium text-[#171717] truncate max-w-[140px]">{p.name}</p>
                      <p className="text-xs text-[#77776F]">{p.sku}</p>
                    </td>
                    <td className="py-2 text-right tabular-nums text-[#77776F]">{p.quantity}</td>
                    <td className="py-2 text-right tabular-nums font-medium text-[#171717]">
                      {formatNPR(p.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl border border-[#E4E1D8] p-5">
          <p className="text-sm font-semibold text-[#171717] mb-4">Category Breakdown</p>
          {data.categoryBreakdown.length === 0 ? (
            <p className="text-xs text-[#77776F] text-center py-4">No data</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-[#77776F] uppercase tracking-wide border-b border-[#E4E1D8]">
                  <th className="text-left pb-2 font-medium">Category</th>
                  <th className="text-right pb-2 font-medium">Items</th>
                  <th className="text-right pb-2 font-medium">Units</th>
                  <th className="text-right pb-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.categoryBreakdown.map((c) => (
                  <tr key={c.category} className="border-b border-[#F4F3EE] last:border-0">
                    <td className="py-2 font-medium text-[#171717]">{c.category}</td>
                    <td className="py-2 text-right tabular-nums text-[#77776F]">{c.itemCount}</td>
                    <td className="py-2 text-right tabular-nums text-[#77776F]">{c.totalQuantity.toLocaleString()}</td>
                    <td className="py-2 text-right tabular-nums font-medium text-[#171717]">
                      {formatNPR(c.totalValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
