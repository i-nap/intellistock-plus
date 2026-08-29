"use client";

import { Package, AlertTriangle, ShoppingCart, TrendingUp } from "lucide-react";
import { MetricCard } from "./metric-card";
import { useDashboardMetrics } from "@/features/dashboard/hooks";
import { formatNPR } from "@/lib/utils";

export function MetricsSection() {
  const { data, isLoading } = useDashboardMetrics();
  const { sparklines } = data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 h-full">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white animate-pulse h-36" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Left: hero (accent) + inventory */}
      <div className="flex flex-col gap-4">
        <MetricCard
          label="Total Products"
          value={data.totalProducts.toLocaleString()}
          change={{ value: "8% this month", positive: true }}
          icon={Package}
          sparkline={sparklines.totalProducts}
          variant="accent"
          className="flex-[3]"
        />
        <MetricCard
          label="Inventory Value"
          value={formatNPR(data.inventoryValue, 0)}
          change={{ value: "12% this month", positive: true }}
          icon={TrendingUp}
          sparkline={sparklines.inventoryValue}
          variant="default"
          className="flex-[2]"
        />
      </div>

      {/* Right: low stock + cyan (pending orders) */}
      <div className="flex flex-col gap-4">
        <MetricCard
          label="Low Stock Items"
          value={data.lowStockItems.toString()}
          change={{ value: "3 new this week", positive: false }}
          icon={AlertTriangle}
          sparkline={sparklines.lowStockItems}
          variant="default"
          className="flex-[2]"
        />
        <MetricCard
          label="Pending Orders"
          value={data.pendingOrders.toString()}
          change={{ value: "2 new today", positive: true }}
          icon={ShoppingCart}
          sparkline={sparklines.pendingOrders}
          variant="cyan"
          className="flex-[3]"
        />
      </div>
    </div>
  );
}
