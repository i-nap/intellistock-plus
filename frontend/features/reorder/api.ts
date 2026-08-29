import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/types/api";
import type { ReorderRecommendation, GenerateOrderRequest } from "./types";
import type { Order } from "@/features/orders/types";

export async function getRecommendations(): Promise<ReorderRecommendation[]> {
  const { data: res } = await apiClient.get<ApiResponse<ReorderRecommendation[]>>(
    API_ROUTES.REORDER.RECOMMENDATIONS
  );
  return res.data;
}

export async function generateOrder(data: GenerateOrderRequest): Promise<Order> {
  const { data: res } = await apiClient.post<ApiResponse<Order>>(
    API_ROUTES.REORDER.GENERATE_ORDER,
    data
  );
  return res.data;
}
