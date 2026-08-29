import type { Metadata } from "next";
import { MetricsSection } from "@/components/dashboard/metrics-section";
import { StockTrendChart } from "@/components/dashboard/stock-trend-chart";
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table";
import { CategoryStockChart } from "@/components/dashboard/category-stock-chart";
import { ReorderAlertsCard } from "@/components/dashboard/reorder-alerts-card";

export const metadata: Metadata = {
  title: "Dashboard — IntelliStock+",
};

export default function DashboardPage() {
  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      {/* Top bento: metric cards (left) + stock trend chart (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4">
        <MetricsSection />
        <StockTrendChart className="h-full" />
      </div>

      {/* Middle: recent orders (left) + category chart (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-4">
        <RecentOrdersTable />
        <CategoryStockChart />
      </div>

      {/* Bottom: reorder alerts */}
      <ReorderAlertsCard />
    </div>
  );
}
