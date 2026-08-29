"use client";

import { useState } from "react";
import { BarChart3, Package, TrendingUp, ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { ProGate } from "@/components/common/pro-gate";
import { InventorySummaryTab } from "@/components/reports/inventory-summary-tab";
import { StockMovementsTab } from "@/components/reports/stock-movements-tab";
import { OrderSummaryTab } from "@/components/reports/order-summary-tab";

type Tab = "inventory" | "movements" | "orders";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "inventory", label: "Inventory Summary", icon: Package },
  { id: "movements", label: "Stock Movements", icon: TrendingUp },
  { id: "orders", label: "Order Summary", icon: ShoppingCart },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("inventory");

  return (
    <ProGate feature="Reports">
      <PageHeader
        title="Reports"
        description="Analytics and insights across inventory, stock, and orders"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="size-5 text-[#77776F]" />
        </div>
      </PageHeader>

      {/* Tab nav */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-[#E4E1D8] p-1 w-fit mb-6 flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === id
                ? "bg-[#171717] text-white"
                : "text-[#77776F] hover:text-[#171717]"
            }`}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "inventory" && <InventorySummaryTab />}
      {activeTab === "movements" && <StockMovementsTab />}
      {activeTab === "orders" && <OrderSummaryTab />}
    </ProGate>
  );
}
