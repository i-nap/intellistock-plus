import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/types/api";
import type { Product, CreateProductRequest, UpdateProductRequest } from "./types";

export async function listProducts(search?: string): Promise<Product[]> {
  const params = search ? { search } : {};
  const { data: res } = await apiClient.get<ApiResponse<Product[]>>(API_ROUTES.PRODUCTS.LIST, { params });
  return res.data;
}

export async function getProduct(id: number): Promise<Product> {
  const { data: res } = await apiClient.get<ApiResponse<Product>>(API_ROUTES.PRODUCTS.DETAIL(id));
  return res.data;
}

export async function createProduct(data: CreateProductRequest): Promise<Product> {
  const { data: res } = await apiClient.post<ApiResponse<Product>>(API_ROUTES.PRODUCTS.LIST, data);
  return res.data;
}

export async function updateProduct(id: number, data: UpdateProductRequest): Promise<Product> {
  const { data: res } = await apiClient.put<ApiResponse<Product>>(API_ROUTES.PRODUCTS.DETAIL(id), data);
  return res.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(API_ROUTES.PRODUCTS.DETAIL(id));
}
