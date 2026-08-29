import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/types/api";
import type { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from "./types";

export async function listSuppliers(search?: string): Promise<Supplier[]> {
  const params = search ? { search } : {};
  const { data: res } = await apiClient.get<ApiResponse<Supplier[]>>(API_ROUTES.SUPPLIERS.LIST, { params });
  return res.data;
}

export async function getSupplier(id: number): Promise<Supplier> {
  const { data: res } = await apiClient.get<ApiResponse<Supplier>>(API_ROUTES.SUPPLIERS.DETAIL(id));
  return res.data;
}

export async function createSupplier(data: CreateSupplierRequest): Promise<Supplier> {
  const { data: res } = await apiClient.post<ApiResponse<Supplier>>(API_ROUTES.SUPPLIERS.LIST, data);
  return res.data;
}

export async function updateSupplier(id: number, data: UpdateSupplierRequest): Promise<Supplier> {
  const { data: res } = await apiClient.put<ApiResponse<Supplier>>(API_ROUTES.SUPPLIERS.DETAIL(id), data);
  return res.data;
}

export async function deleteSupplier(id: number): Promise<void> {
  await apiClient.delete(API_ROUTES.SUPPLIERS.DETAIL(id));
}
