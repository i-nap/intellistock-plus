import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/types/api";
import type { DashboardMetrics, DashboardCharts, RecentOrder } from "./types";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const { data: res } = await apiClient.get<ApiResponse<DashboardMetrics>>(API_ROUTES.DASHBOARD.METRICS);
  return res.data;
}

export async function getDashboardCharts(): Promise<DashboardCharts> {
  const { data: res } = await apiClient.get<ApiResponse<DashboardCharts>>(API_ROUTES.DASHBOARD.CHARTS);
  return res.data;
}

export async function getRecentOrders(): Promise<RecentOrder[]> {
  const { data: res } = await apiClient.get<ApiResponse<RecentOrder[]>>(API_ROUTES.DASHBOARD.RECENT_ORDERS);
  return res.data;
}
