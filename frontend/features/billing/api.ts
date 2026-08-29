import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/types/api";

export type BillingStatus = { plan: string };

export type EsewaForm = {
  actionUrl: string;
  fields: Record<string, string>;
};

export async function getBillingStatus(): Promise<BillingStatus> {
  const { data: res } = await apiClient.get<ApiResponse<BillingStatus>>(API_ROUTES.BILLING.STATUS);
  return res.data;
}

export async function initiateEsewa(): Promise<EsewaForm> {
  const { data: res } = await apiClient.post<ApiResponse<EsewaForm>>(API_ROUTES.BILLING.INITIATE);
  return res.data;
}
