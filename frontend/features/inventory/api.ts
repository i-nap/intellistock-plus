import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/types/api";
import type { InventoryItem, AdjustStockRequest } from "./types";

export async function listInventory(): Promise<InventoryItem[]> {
  const { data: res } = await apiClient.get<ApiResponse<InventoryItem[]>>(API_ROUTES.INVENTORY.LIST);
  return res.data;
}

export async function getInventoryItem(id: number): Promise<InventoryItem> {
  const { data: res } = await apiClient.get<ApiResponse<InventoryItem>>(API_ROUTES.INVENTORY.DETAIL(id));
  return res.data;
}

export async function adjustStock(id: number, data: AdjustStockRequest): Promise<InventoryItem> {
  const { data: res } = await apiClient.post<ApiResponse<InventoryItem>>(API_ROUTES.INVENTORY.ADJUST(id), data);
  return res.data;
}

export async function getLowStockItems(): Promise<InventoryItem[]> {
  const { data: res } = await apiClient.get<ApiResponse<InventoryItem[]>>(API_ROUTES.INVENTORY.LOW_STOCK);
  return res.data;
}
