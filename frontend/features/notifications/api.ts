import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/types/api";
import type { AppNotification } from "./types";

export async function getNotifications(): Promise<AppNotification[]> {
  const { data: res } = await apiClient.get<ApiResponse<AppNotification[]>>(
    API_ROUTES.NOTIFICATIONS.LIST
  );
  return res.data;
}

export async function markNotificationRead(id: number): Promise<AppNotification> {
  const { data: res } = await apiClient.patch<ApiResponse<AppNotification>>(
    API_ROUTES.NOTIFICATIONS.MARK_READ(id)
  );
  return res.data;
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch(API_ROUTES.NOTIFICATIONS.MARK_ALL_READ);
}
