import type { OrderStatus } from "@/constants/status";

export type SparklinePoint = { v: number };

export type DashboardMetrics = {
  totalProducts: number;
  lowStockItems: number;
  pendingOrders: number;
  inventoryValue: number;
  sparklines: {
    totalProducts: SparklinePoint[];
    lowStockItems: SparklinePoint[];
    pendingOrders: SparklinePoint[];
    inventoryValue: SparklinePoint[];
  };
};

export type StockTrendPoint = {
  date: string;
  value: number;
};

export type CategoryStock = {
  category: string;
  stock: number;
};

export type ReorderAlert = {
  id: number;
  product: string;
  sku: string;
  current: number;
  minimum: number;
  supplier: string;
};

export type RecentOrder = {
  id: string;
  supplier: string;
  items: number;
  total: number;
  status: OrderStatus;
  date: string;
};

export type DashboardCharts = {
  stockTrend: StockTrendPoint[];
  categoryStock: CategoryStock[];
};
