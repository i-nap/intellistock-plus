import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { TeamMember, CreateUserRequest, UpdateRoleRequest } from "./types";

export async function fetchUsers(): Promise<TeamMember[]> {
  const res = await apiClient.get(API_ROUTES.USERS.LIST);
  return res.data.data;
}

export async function createUserApi(data: CreateUserRequest): Promise<TeamMember> {
  const res = await apiClient.post(API_ROUTES.USERS.CREATE, data);
  return res.data.data;
}

export async function updateUserRoleApi(id: number, data: UpdateRoleRequest): Promise<TeamMember> {
  const res = await apiClient.patch(API_ROUTES.USERS.UPDATE_ROLE(id), data);
  return res.data.data;
}

export async function deleteUserApi(id: number): Promise<void> {
  await apiClient.delete(API_ROUTES.USERS.DELETE(id));
}
