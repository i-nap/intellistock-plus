import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/types/api";
import type { InventorySummaryReport, StockMovementEntry, OrderSummaryReport } from "./types";

export async function getInventorySummary(): Promise<InventorySummaryReport> {
  const { data: res } = await apiClient.get<ApiResponse<InventorySummaryReport>>(
    API_ROUTES.REPORTS.INVENTORY_SUMMARY
  );
  return res.data;
}

export async function getStockMovements(days: number): Promise<StockMovementEntry[]> {
  const { data: res } = await apiClient.get<ApiResponse<StockMovementEntry[]>>(
    API_ROUTES.REPORTS.STOCK_MOVEMENTS,
    { params: { days } }
  );
  return res.data;
}

export async function getOrderSummary(): Promise<OrderSummaryReport> {
  const { data: res } = await apiClient.get<ApiResponse<OrderSummaryReport>>(
    API_ROUTES.REPORTS.ORDER_SUMMARY
  );
  return res.data;
}
