import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/types/api";
import type { Order, CreateOrderRequest, UpdateOrderStatusRequest } from "./types";
import type { OrderStatus } from "@/constants/status";

export async function listOrders(status?: OrderStatus): Promise<Order[]> {
  const params = status ? { status } : {};
  const { data: res } = await apiClient.get<ApiResponse<Order[]>>(API_ROUTES.ORDERS.LIST, { params });
  return res.data;
}

export async function getOrder(id: number): Promise<Order> {
  const { data: res } = await apiClient.get<ApiResponse<Order>>(API_ROUTES.ORDERS.DETAIL(id));
  return res.data;
}

export async function createOrder(data: CreateOrderRequest): Promise<Order> {
  const { data: res } = await apiClient.post<ApiResponse<Order>>(API_ROUTES.ORDERS.LIST, data);
  return res.data;
}

export async function updateOrderStatus(id: number, data: UpdateOrderStatusRequest): Promise<Order> {
  const { data: res } = await apiClient.patch<ApiResponse<Order>>(API_ROUTES.ORDERS.UPDATE_STATUS(id), data);
  return res.data;
}
